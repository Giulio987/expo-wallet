import * as React from 'react'
import type { ViewProps } from 'react-native'
import { callback, getHostComponent } from 'react-native-nitro-modules'
import AddToWalletButtonConfig from '../nitrogen/generated/shared/json/AddToWalletButtonConfig.json'
import type {
  AddToWalletButtonMethods,
  AddToWalletButtonProps as NativeProps,
} from './specs/AddToWalletButton.nitro'

const NativeButton = getHostComponent<NativeProps, AddToWalletButtonMethods>(
  'AddToWalletButton',
  () => AddToWalletButtonConfig
)

export interface AddToWalletButtonProps extends ViewProps {
  buttonStyle?: NativeProps['buttonStyle']
  onPress: () => void
}

export function AddToWalletButton({
  onPress,
  ...props
}: AddToWalletButtonProps) {
  return <NativeButton {...props} onPress={callback(onPress)} />
}
