import PassKit
import UIKit

class HybridAddToWalletButton: HybridAddToWalletButtonSpec {
  var onPress: () -> Void = {}

  var buttonStyle: AddToWalletButtonStyle? = nil {
    didSet { rebuildButton() }
  }

  /// Stable container: Nitro expects `view` to never change, but PKAddPassButton's style is immutable.
  let view = UIView()
  private var button: PKAddPassButton?

  override init() {
    super.init()
    rebuildButton()
  }

  private func rebuildButton() {
    button?.removeFromSuperview()
    let style: PKAddPassButtonStyle = buttonStyle == .blackoutline ? .blackOutline : .black
    let newButton = PKAddPassButton(addPassButtonStyle: style)
    newButton.translatesAutoresizingMaskIntoConstraints = false
    newButton.addTarget(self, action: #selector(handlePress), for: .touchUpInside)
    view.addSubview(newButton)
    NSLayoutConstraint.activate([
      newButton.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      newButton.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      newButton.topAnchor.constraint(equalTo: view.topAnchor),
      newButton.bottomAnchor.constraint(equalTo: view.bottomAnchor),
    ])
    button = newButton
  }

  @objc private func handlePress() {
    onPress()
  }
}
