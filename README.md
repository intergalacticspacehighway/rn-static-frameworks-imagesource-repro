# ReactCodegen fails with static frameworks: `ImageRequestParams.h` not found

A plain React Native 0.89.0-rc.2 app, created with `npx @react-native-community/cli init ImageSourceRepro --version 0.89.0-rc.2`. The only change is one codegen component that has an `ImageSource` prop ([`specs/ImageSourceViewNativeComponent.ts`](specs/ImageSourceViewNativeComponent.ts)) and its `codegenConfig` in `package.json`.

## Steps

```sh
npm install
cd ios
bundle install
USE_FRAMEWORKS=static RCT_USE_RN_DEP=0 RCT_USE_PREBUILT_RNCORE=0 bundle exec pod install
xcodebuild -workspace ImageSourceRepro.xcworkspace -scheme ImageSourceRepro \
  -configuration Release -sdk iphonesimulator -derivedDataPath build
```

## Result

```
React_Fabric.framework/Headers/react/renderer/imagemanager/ImageManager.h:17:10:
fatal error: 'react/renderer/imagemanager/ImageRequestParams.h' file not found
```

The generated `Props.h` includes `<React/ImageManager.h>`. That umbrella includes `ImageManager.h`, which needs `ImageRequestParams.h` from `React_ImageManager.framework`. The `ReactCodegen` pod has no header search path for `React-ImageManager`.

The build passes with the prebuilt core (`RCT_USE_PREBUILT_RNCORE=1`). It also passes when this line is added to `scripts/codegen/templates/ReactCodegen.podspec.template`:

```ruby
.concat(ReactNativePodsUtils.create_header_search_path_for_frameworks("PODS_CONFIGURATION_BUILD_DIR", "React-ImageManager", "React_ImageManager", []))
```
