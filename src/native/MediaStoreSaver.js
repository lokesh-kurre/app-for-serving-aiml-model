import { NativeModules } from "react-native";
const { MediaStoreSaver } = NativeModules;

export default {
  saveImage: (path) => MediaStoreSaver.saveImage(path),

  appendMetadata: (data) =>
    MediaStoreSaver.appendMetadata(JSON.stringify(data)),
};
