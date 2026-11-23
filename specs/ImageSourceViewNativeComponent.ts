import type {HostComponent, ImageSource, ViewProps} from 'react-native';
import {codegenNativeComponent} from 'react-native';

export interface NativeProps extends ViewProps {
  source?: ImageSource;
}

export default codegenNativeComponent<NativeProps>('ImageSourceView', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
