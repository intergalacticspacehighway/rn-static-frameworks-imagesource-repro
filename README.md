# RN 0.89: `ImageRequestParams.h` not found with static frameworks

With `USE_FRAMEWORKS=static` and React Native built from source, an iOS build fails when a library's codegen spec has an `ImageSource` prop. This repo is the result of the steps below.

## Steps

```sh
npx @react-native-community/cli@latest init SliderRepro --version 0.89.0-rc.2
cd SliderRepro
npm install @react-native-community/slider@5.2.2
cd ios
bundle install
USE_FRAMEWORKS=static RCT_USE_RN_DEP=0 RCT_USE_PREBUILT_RNCORE=0 bundle exec pod install
xcodebuild -workspace SliderRepro.xcworkspace -scheme SliderRepro \
  -configuration Release -sdk iphonesimulator -derivedDataPath build
```

## Result

```
In file included from build/generated/ios/ReactCodegen/react/renderer/components/RNCSlider/Props.cpp:11:
In file included from build/generated/ios/ReactCodegen/react/renderer/components/RNCSlider/Props.h:13:
In file included from React_Fabric.framework/Headers/React/ImageManager.h:34:
React_Fabric.framework/Headers/react/renderer/imagemanager/ImageManager.h:17:10:
fatal error: 'react/renderer/imagemanager/ImageRequestParams.h' file not found
```

`ImageRequestParams.h` is in `React_ImageManager.framework`, but the `ReactCodegen` pod has no header search path for `React-ImageManager`. The build passes after this line is added to `scripts/codegen/templates/ReactCodegen.podspec.template`:

```ruby
.concat(ReactNativePodsUtils.create_header_search_path_for_frameworks("PODS_CONFIGURATION_BUILD_DIR", "React-ImageManager", "React_ImageManager", []))
```
