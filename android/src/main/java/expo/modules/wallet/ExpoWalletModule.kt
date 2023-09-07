package expo.modules.wallet

import android.app.Activity
import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import com.google.android.gms.pay.Pay
import com.google.android.gms.pay.PayApiAvailabilityStatus
import com.google.android.gms.pay.PayClient

class ExpoWalletModule : Module() {
    private lateinit var walletClient: PayClient
    private val addToGoogleWalletRequestCode = 1000
    private val context: Context
    get() = appContext.reactContext ?: throw CodedException("NO_CONTEXT")
    private val currentActivity: Activity
    get() = appContext.currentActivity ?: throw CodedException("NO_ACTIVITY")

    override fun definition() = ModuleDefinition {
        Name("ExpoWallet")
        AsyncFunction("addPassFromToken") { token: String, promise: Promise->
          try{
            if(currentActivity != null && walletClient != null){
              walletClient.savePassesJwt(token, currentActivity, addToGoogleWalletRequestCode)
            }else {
              promise.reject(CodedException("Error on activity"))
            }
          } catch (e: Exception) {
            promise.reject(CodedException("GOOGLE_WALLET_API_NOT_AVAILABLE"))
          }
        }
      AsyncFunction("isAvailable") { promise: Promise ->
        try {
          if(currentActivity != null){
            walletClient = Pay.getClient(context)
            walletClient.getPayApiAvailabilityStatus(PayClient.RequestType.SAVE_PASSES)
            .addOnSuccessListener { status: Int ->
                    promise.resolve(status == PayApiAvailabilityStatus.AVAILABLE)
                  }
                  .addOnFailureListener {
                    promise.resolve(false)
                  }
          }else {
              promise.resolve(false)
          }
          
        } catch (e: Exception) {
          promise.resolve(false)
        }
      }
    }

    //private fun fetchCanUsageGoogleWalletApi(callback: (Boolean) -> Unit) {
        //walletClient.getPayApiAvailabilityStatus(PayClient.RequestType.SAVE_PASSES)
        //.addOnSuccessListener { status: Boolean ->
                    //val isAvailable = status == PayApiAvailabilityStatus.AVAILABLE
                    //callback(isAvailable)
                    //      }
        //.addOnFailureListener {
                    //callback(false)
                    //      }
        //}
}
