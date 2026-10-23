package com.margelo.nitro.expowallet

import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.widget.Button
import com.facebook.react.uimanager.ThemedReactContext

class HybridAddToWalletButton(context: ThemedReactContext) : HybridAddToWalletButtonSpec() {
  private val button = Button(context).apply {
    text = "Add to Google Wallet"
    isAllCaps = false
    setTextColor(Color.WHITE)
    gravity = Gravity.CENTER
    setOnClickListener { onPress() }
  }

  override val view: View
    get() = button

  override var onPress: () -> Unit = {}

  override var buttonStyle: AddToWalletButtonStyle? = null
    set(value) {
      field = value
      applyStyle(value)
    }

  init {
    applyStyle(null)
  }

  private fun applyStyle(style: AddToWalletButtonStyle?) {
    val radius = 100f * button.resources.displayMetrics.density
    button.background = GradientDrawable().apply {
      cornerRadius = radius
      setColor(Color.BLACK)
      if (style == AddToWalletButtonStyle.BLACKOUTLINE) {
        setStroke((1 * button.resources.displayMetrics.density).toInt(), Color.WHITE)
      }
    }
  }
}
