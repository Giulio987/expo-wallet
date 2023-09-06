import ExpoModulesCore
import PassKit
public class ExpoWalletModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWallet")
    AsyncFunction("addPassFromBase64") { (value: String, promise: Promise) in
      let library = PKPassLibrary()
      let NSData = NSData(base64Encoded: value, options: NSData.Base64DecodingOptions.ignoreUnknownCharacters)

      if PKPassLibrary.isPassLibraryAvailable(){
        do {
          let pass = try PKPass(data: NSData! as Data)
          library.addPasses([pass], withCompletionHandler: ((PKPassLibraryAddPassesStatus) -> Void)? {(status) in 
            if status == PKPassLibraryAddPassesStatus.didAddPasses {
              promise.resolve(true)
            } else {
              promise.reject(Exception(name: "E_PASS_LIBRARY_UNAVAILABLE1", description: "Pass library unavailable"))
            }
          })
        } catch {
          promise.reject(Exception(name: "E_PASS_LIBRARY_UNAVAILABLE2", description: "Pass library unavailable"))
        }
      } else {
        promise.reject(Exception(name: "E_PASS_LIBRARY_UNAVAILABLE3", description: "Pass library unavailable"))
      }
    }
  }
}
