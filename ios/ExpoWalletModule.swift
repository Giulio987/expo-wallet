import ExpoModulesCore
import PassKit
public class ExpoWalletModule: Module {
  let library = PKPassLibrary()
  public func definition() -> ModuleDefinition {
    Name("ExpoWallet")
    AsyncFunction("addPassFromFile") { (value: String,encoding: String, promise: Promise) in
    let data:NSData
    if(encoding == "base64"){
      data = NSData(base64Encoded: value, options: NSData.Base64DecodingOptions.ignoreUnknownCharacters)
    }else{
        //TODO
        
      }
      if PKPassLibrary.isPassLibraryAvailable() {
        do {
          let pass = try PKPass(data: data! as Data)
          library.addPasses([pass], withCompletionHandler: ((PKPassLibraryAddPassesStatus) -> Void)? {(status) in 
            if status == PKPassLibraryAddPassesStatus.didAddPasses {
              promise.resolve(true)
            } else {
              promise.reject(Exception(name: "E_PASS_LIBRARY_UNAVAILABLE1", description: "Cannot add pass"))
            }
          })
        } catch {
          promise.reject(Exception(name: "E_PASS_LIBRARY_UNAVAILABLE2", description: "Error creating pass from data"))
        }
      } else {
        promise.reject(Exception(name: "E_PASS_LIBRARY_UNAVAILABLE3", description: "Pass library unavailable"))
      }
    }
    Function("isAvailable") { () -> Bool in
      if PKPassLibrary.isPassLibraryAvailable(){
        return true
      } else {
        return false
      }
    }
  }
}