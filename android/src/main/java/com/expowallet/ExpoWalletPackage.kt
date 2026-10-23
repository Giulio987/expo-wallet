package com.expowallet

import android.view.View
import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import com.margelo.nitro.expowallet.ExpoWalletOnLoad
import com.margelo.nitro.expowallet.views.HybridAddToWalletButtonManager

class ExpoWalletPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? = null

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider { emptyMap() }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<out View, out ReactShadowNode<*>>> =
    listOf(HybridAddToWalletButtonManager())

  companion object {
    init {
      ExpoWalletOnLoad.initializeNative()
    }
  }
}
