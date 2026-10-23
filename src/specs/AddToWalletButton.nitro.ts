import type {
  HybridView,
  HybridViewMethods,
  HybridViewProps,
} from 'react-native-nitro-modules'

export type AddToWalletButtonStyle = 'black' | 'blackOutline'

export interface AddToWalletButtonProps extends HybridViewProps {
  buttonStyle?: AddToWalletButtonStyle
  onPress: () => void
}

export interface AddToWalletButtonMethods extends HybridViewMethods {}

export type AddToWalletButton = HybridView<
  AddToWalletButtonProps,
  AddToWalletButtonMethods,
  { ios: 'swift'; android: 'kotlin' }
>
