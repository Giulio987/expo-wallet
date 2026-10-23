import Foundation
import NitroModules
import PassKit
import UIKit

private enum WalletError: Error, LocalizedError {
  case unavailable
  case invalidData(index: Int?)
  case cannotPresent
  case notFound
  case busy

  var errorDescription: String? {
    switch self {
    case .unavailable: return "E_PASS_LIBRARY_UNAVAILABLE: Pass library unavailable"
    case .invalidData(let index):
      if let index = index {
        return "E_PASS_LIBRARY_INVALID_DATA: Invalid data for pass at index \(index)"
      }
      return "E_PASS_LIBRARY_INVALID_DATA: No pass data given"
    case .cannotPresent: return "E_PASS_LIBRARY_CANNOT_ADD: Cannot present the add pass sheet"
    case .notFound: return "E_PASS_LIBRARY_NOT_FOUND: Pass not found"
    case .busy: return "E_PASS_LIBRARY_BUSY: Another add pass request is in progress"
    }
  }
}

/// Resolves the promise when the system "Add pass" sheet is dismissed.
private final class AddPassesDelegate: NSObject, PKAddPassesViewControllerDelegate {
  private let passes: [PKPass]
  private let library: PKPassLibrary
  private let promise: Promise<Bool>
  private let onFinish: () -> Void
  private var retainSelf: AddPassesDelegate?

  init(passes: [PKPass], library: PKPassLibrary, promise: Promise<Bool>, onFinish: @escaping () -> Void) {
    self.passes = passes
    self.library = library
    self.promise = promise
    self.onFinish = onFinish
    super.init()
    retainSelf = self  // PKAddPassesViewController only holds its delegate weakly
  }

  func addPassesViewControllerDidFinish(_ controller: PKAddPassesViewController) {
    controller.dismiss(animated: true) { [self] in
      onFinish()
      promise.resolve(withResult: passes.allSatisfy { library.containsPass($0) })
      retainSelf = nil
    }
  }
}

class HybridWallet: HybridWalletSpec {
  private let library = PKPassLibrary()

  func isAvailable() throws -> Promise<Bool> {
    return Promise.resolved(withResult: PKPassLibrary.isPassLibraryAvailable())
  }

  func canAddPasses() throws -> Bool {
    return PKAddPassesViewController.canAddPasses()
  }

  func addPass(data: String) throws -> Promise<Bool> {
    return present(passesData: [data])
  }

  func addPasses(data: [String]) throws -> Promise<Bool> {
    return present(passesData: data)
  }

  func getPasses() throws -> Promise<[WalletPass]> {
    guard PKPassLibrary.isPassLibraryAvailable() else {
      return Promise.rejected(withError: WalletError.unavailable)
    }
    let passes = library.passes().map { pass in
      WalletPass(
        passTypeIdentifier: pass.passTypeIdentifier,
        serialNumber: pass.serialNumber,
        organizationName: pass.organizationName,
        localizedName: pass.localizedName,
        localizedDescription: pass.localizedDescription,
        relevantDate: pass.relevantDate.map { $0.timeIntervalSince1970 * 1000 },
        passURL: pass.passURL?.absoluteString,
        isRemotePass: pass.isRemotePass
      )
    }
    return Promise.resolved(withResult: passes)
  }

  func containsPass(passTypeIdentifier: String, serialNumber: String) throws -> Promise<Bool> {
    guard PKPassLibrary.isPassLibraryAvailable() else {
      return Promise.rejected(withError: WalletError.unavailable)
    }
    let pass = library.pass(withPassTypeIdentifier: passTypeIdentifier, serialNumber: serialNumber)
    return Promise.resolved(withResult: pass != nil)
  }

  func removePass(passTypeIdentifier: String, serialNumber: String) throws -> Promise<Bool> {
    guard PKPassLibrary.isPassLibraryAvailable() else {
      return Promise.rejected(withError: WalletError.unavailable)
    }
    guard let pass = library.pass(withPassTypeIdentifier: passTypeIdentifier, serialNumber: serialNumber)
    else {
      return Promise.rejected(withError: WalletError.notFound)
    }
    library.removePass(pass)
    return Promise.resolved(withResult: true)
  }

  /// Only touched on the main thread.
  private static var isPresenting = false

  /// Resolves `true` when every pass ended up in Wallet, `false` if the user cancelled
  /// (or only added some of the passes). Passes already in Wallet are not presented again.
  private func present(passesData: [String]) -> Promise<Bool> {
    guard PKPassLibrary.isPassLibraryAvailable() else {
      return Promise.rejected(withError: WalletError.unavailable)
    }
    guard !passesData.isEmpty else {
      return Promise.rejected(withError: WalletError.invalidData(index: nil))
    }
    var passes: [PKPass] = []
    for (index, base64) in passesData.enumerated() {
      guard let data = Data(base64Encoded: base64, options: .ignoreUnknownCharacters),
        let pass = try? PKPass(data: data)
      else {
        return Promise.rejected(withError: WalletError.invalidData(index: index))
      }
      passes.append(pass)
    }

    let promise = Promise<Bool>()
    DispatchQueue.main.async { [library] in
      let missing = passes.filter { !library.containsPass($0) }
      if missing.isEmpty {
        promise.resolve(withResult: true)
        return
      }
      guard !Self.isPresenting else {
        promise.reject(withError: WalletError.busy)
        return
      }
      guard let presenter = Self.topViewController(),
        let controller = PKAddPassesViewController(passes: missing)
      else {
        promise.reject(withError: WalletError.cannotPresent)
        return
      }
      Self.isPresenting = true
      controller.delegate = AddPassesDelegate(passes: passes, library: library, promise: promise) {
        Self.isPresenting = false
      }
      presenter.present(controller, animated: true)
    }
    return promise
  }

  private static func topViewController() -> UIViewController? {
    let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
    let scene = scenes.first { $0.activationState == .foregroundActive } ?? scenes.first
    var top = (scene?.windows.first(where: { $0.isKeyWindow }) ?? scene?.windows.first)?.rootViewController
    while let presented = top?.presentedViewController {
      top = presented
    }
    return top
  }
}
