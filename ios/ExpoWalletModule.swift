import ExpoModulesCore
import PassKit
public class ExpoWalletModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoWallet")
        AsyncFunction("addPass") { (value: String, promise: Promise) in
            let library = PKPassLibrary()
            let passData = NSData(base64Encoded: value, options: NSData.Base64DecodingOptions.ignoreUnknownCharacters)

            if PKPassLibrary.isPassLibraryAvailable(){
                do {
                    if let passData = passData as? Data {
                        let pass = try PKPass(data: passData)
                        library.addPasses([pass], withCompletionHandler: ((PKPassLibraryAddPassesStatus) -> Void)? {(status) in
                            if status == PKPassLibraryAddPassesStatus.didAddPasses {
                                promise.resolve(true)
                            } else {
                                promise.reject(Exception(name: "E_PASS_LIBRARY_CANNOT_ADD", description: "Cannot add the pass to the wallet"))
                            }
                        })
                    } else {
                        promise.reject(Exception(name: "E_PASS_LIBRARY_INVALID_DATA", description: "Invalid data for given pass"))
                    }
                } catch {
                    print(error)
                    promise.reject(Exception(name: "E_PASS_LIBRARY_GENERIC", description: "Error while adding pass to wallet"))
                }
            } else {
                promise.reject(Exception(name: "E_PASS_LIBRARY_UNAVAILABLE", description: "Pass library unavailable"))
            }
        }
        AsyncFunction("isAvailable") { (promise: Promise) in
            if PKPassLibrary.isPassLibraryAvailable() {
                promise.resolve(true)
            }else{
                promise.resolve(false)
            }
        }
    }
}
