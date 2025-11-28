export default function makeHumanFriendly(raw) {
    if (!raw) return {};
    const map = {
      Make: 'Brand', Model: 'Camera Model', LensModel: 'Lens', ImageWidth: 'Width', ImageLength: 'Height',
      FocalLength: 'Focal Length', FocalLengthIn35mmFilm: 'Focal Length (35mm)', ExposureTime: 'Exposure Time',
      ExposureBiasValue: 'Exposure Bias', ExposureProgram: 'Exposure Program', ISOSpeedRatings: 'ISO',
      FNumber: 'Aperture', WhiteBalance: 'White Balance', MeteringMode: 'Metering', Flash: 'Flash',
      Orientation: 'Orientation', DateTimeOriginal: 'Captured At', Software: 'Software', ColorSpace: 'Color Space'
    };
    const friendly = {};
    for (const [k,v] of Object.entries(raw)) if (map[k]) friendly[map[k]] = v;
    return friendly;
  }