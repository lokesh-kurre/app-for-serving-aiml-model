let ExifModule = null;
export default async function loadExifModule() {
  if (!ExifModule) {
    try {
      const module = await import('react-native-exif');
      ExifModule = module.default || module;
    } catch (e) {
      ExifModule = null;
    }
  }
  return ExifModule;
}