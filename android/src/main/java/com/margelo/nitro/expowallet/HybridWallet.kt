package com.margelo.nitro.expowallet

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.BaseActivityEventListener
import com.google.android.gms.pay.Pay
import com.google.android.gms.pay.PayApiAvailabilityStatus
import com.google.android.gms.pay.PayClient
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise

class HybridWallet : HybridWalletSpec() {
  private val reactContext
    get() = NitroModules.applicationContext
      ?: throw Error("E_NO_CONTEXT: React context is not available")

  private var pendingAdd: Promise<Boolean>? = null
  private var listenerRegistered = false

  private val activityListener = object : BaseActivityEventListener() {
    override fun onActivityResult(
      activity: Activity,
      requestCode: Int,
      resultCode: Int,
      data: Intent?
    ) {
      if (requestCode != ADD_TO_WALLET_REQUEST_CODE) return
      val promise = pendingAdd ?: return
      pendingAdd = null
      when (resultCode) {
        Activity.RESULT_OK -> promise.resolve(true)
        Activity.RESULT_CANCELED -> promise.resolve(false)
        PayClient.SavePassesResult.SAVE_ERROR -> {
          val message = data?.getStringExtra(PayClient.EXTRA_API_ERROR_MESSAGE)
          promise.reject(Error("E_PASS_LIBRARY_GENERIC: ${message ?: "Error while adding pass to wallet"}"))
        }
        else -> promise.reject(Error("E_PASS_LIBRARY_GENERIC: Unexpected result code $resultCode"))
      }
    }
  }

  override fun isAvailable(): Promise<Boolean> {
    val promise = Promise<Boolean>()
    try {
      Pay.getClient(reactContext)
        .getPayApiAvailabilityStatus(PayClient.RequestType.SAVE_PASSES)
        .addOnSuccessListener { status -> promise.resolve(status == PayApiAvailabilityStatus.AVAILABLE) }
        .addOnFailureListener { promise.resolve(false) }
    } catch (e: Exception) {
      promise.resolve(false)
    }
    return promise
  }

  override fun canAddPasses(): Boolean = false

  override fun addPass(data: String): Promise<Boolean> {
    val promise = Promise<Boolean>()
    val activity = reactContext.currentActivity
    if (activity == null) {
      promise.reject(Error("E_NO_ACTIVITY: No current activity"))
      return promise
    }
    if (pendingAdd != null) {
      promise.reject(Error("E_PASS_LIBRARY_BUSY: Another add pass request is in progress"))
      return promise
    }
    try {
      if (!listenerRegistered) {
        reactContext.addActivityEventListener(activityListener)
        listenerRegistered = true
      }
      pendingAdd = promise
      Pay.getClient(activity).savePassesJwt(data, activity, ADD_TO_WALLET_REQUEST_CODE)
    } catch (e: Exception) {
      pendingAdd = null
      promise.reject(Error("E_PASS_LIBRARY_UNAVAILABLE: ${e.message ?: "Google Wallet API not available"}"))
    }
    return promise
  }

  override fun addPasses(data: Array<String>): Promise<Boolean> = unsupported("addPasses")

  override fun getPasses(): Promise<Array<WalletPass>> = unsupported("getPasses")

  override fun containsPass(passTypeIdentifier: String, serialNumber: String): Promise<Boolean> =
    unsupported("containsPass")

  override fun removePass(passTypeIdentifier: String, serialNumber: String): Promise<Boolean> =
    unsupported("removePass")

  private fun <T> unsupported(method: String): Promise<T> =
    Promise.rejected(Error("UNSUPPORTED: $method is not available on Android"))

  companion object {
    private const val ADD_TO_WALLET_REQUEST_CODE = 1000
  }
}
