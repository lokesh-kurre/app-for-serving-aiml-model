#ifndef AIML_TYPES_H
#define AIML_TYPES_H

#include <vector>
#include <cstdint>
#include <memory>
#include <string>
#include <map>

namespace aiml {

    /**
     * Image data structure for processing
     */
    template<typename T>
    struct ImageData {
        std::vector<T> data;  // Raw image data
        int width;
        int height;
        int channels;  // Number of channels (e.g., 3 for RGB, 1 for grayscale, 0 for no channel dimension)

        ImageData() : width(0), height(0), channels(0) {}

        ImageData(int w, int h, int c)
                : width(w), height(h), channels(c) {
            // If channels is 0, ignore channel dimension (store HW only)
            int size = (c == 0) ? (w * h) : (w * h * c);
            data.resize(size);
        }

        template<typename T0>
        ImageData(const ImageData<T0>& d)
                : width(d.width), height(d.height), channels(d.channels) {
            data.resize(d.data.size());
            for (int i = 0; i < d.data.size(); ++i) {
                data[i] = static_cast<T>(d.data[i]);
            }
        }
    };

    /**
     * Normalized tensor data for model input
     */
    template<typename T>
    struct TensorData {
        std::vector<T> data;      // Normalized float data
        std::vector<int> shape;   // Tensor shape [batch, height, width, channels] or [batch, channels, height, width]

        TensorData() {}

        TensorData(const std::vector<int>& s) : shape(s) {
            int total_size = 1;
            for (int dim : shape) {
                total_size *= dim;
            }
            data.resize(total_size);
        }

        template<typename T0>
        TensorData(const ImageData<T0>& d) {
            shape.assign({1, d.height, d.width, d.channels});
            int total_pixels = d.width * d.height;
            data.resize(total_pixels * d.channels);
            for (int i = 0; i < total_pixels; ++i) {
                for (int c = 0; c < std::max(1, d.channels); ++c) {
                    int idx = i * d.channels + c;
                    data[idx] = static_cast<T>(d.data[idx]);
                }
            }
        }
    };

    /**
     * BroadCastable parameters
     */
    template <typename T>
    struct BroadCastableParams {
        std::vector<T> value;   // value per channel
        size_t channels;

        BroadCastableParams(): value(0), channels(0) {}

        BroadCastableParams(const std::vector<T>& v)
                : value(v), channels(v.size()) {}

        BroadCastableParams(const std::initializer_list<T>& lst)
                : value(lst), channels(lst.size()) {}

        /**
         * Constructor with single values (broadcasted to all channels)
         * @param m Single value to be used for all channels
         */
        BroadCastableParams(T v) : value(1, v), channels(1) {}

        /**
         * Access operator to get value for specific channel
         * If only one value is provided, it is broadcasted to all channels
         */
        T operator[](size_t idx) const {
            if (channels == 1 || idx >= channels) {
                return value[0]; // Broadcast single value
            } else {
                return value[idx];
            }
        }

    };

    /**
     * Normalization parameters
     */
    struct NormalizationParams {
        BroadCastableParams<float> mean;   // Mean values per channel
        BroadCastableParams<float> scale;  // Scale (std) values per channel
    };

    /**
     * Crop region specification
     */
    struct CropRegion {
        int x;      // Top-left x coordinate
        int y;      // Top-left y coordinate
        int width;  // Crop width
        int height; // Crop height

        CropRegion() : x(0), y(0), width(0), height(0) {}

        CropRegion(int x_, int y_, int w, int h)
                : x(x_), y(y_), width(w), height(h) {}
    };

    /**
     * Padding specification
     */
    struct Padding {
        int top;
        int bottom;
        int left;
        int right;

        Padding() : top(0), bottom(0), left(0), right(0) {}

        Padding(int t, int b, int l, int r)
                : top(t), bottom(b), left(l), right(r) {}

        Padding(int all) : top(all), bottom(all), left(all), right(all) {}
    };

    /**
     * Padding mode for crop operations
     */
    enum class PaddingMode {
        NONE,      // No padding, throw error if crop exceeds bounds
        CONSTANT,  // Pad with constant value
        REPLICATE, // Replicate edge pixels
        REFLECT    // Reflect pixels at border
    };

    /**
     * Parse padding mode from string
     */
    PaddingMode parsePaddingMode(const std::string& mode_str);

    /**
     * PadFillValue parameters
     */
    struct FillValue {
        BroadCastableParams<uint8_t> value;   // value per channel
        FillValue() {}
        FillValue(int v): value(v) {}
    };

    /**
     * Aspect ratio preservation mode for resize operations
     */
    enum class AspectRatioMode {
        NONE,             // No aspect ratio preservation (stretch to fit)
        MAINTAIN_WIDTH,   // Maintain aspect ratio, fit to width
        MAINTAIN_HEIGHT,  // Maintain aspect ratio, fit to height
        MAINTAIN_LONGEST  // Maintain aspect ratio, fit to longest dimension
    };

    AspectRatioMode parseAspectRatioMode(const std::string& mode_str);

    /**
     * @brief Interpolation type for resizing operations
     */
    enum class InterpolationType {
        INTERP_NEAREST,   // Nearest neighbor interpolation (fast, low quality)
        INTERP_LINEAR,    // Bilinear interpolation (default, good balance)
        INTERP_AREA       // Area-based interpolation (good for downscaling)
    };

    InterpolationType parseInterpolationType(const std::string& interp_str);

    /**
     * Quantization data types for model inference
     */
    enum class QuantizationType {
        FLOAT32,   // 32-bit floating point (default)
        FLOAT16,   // 16-bit floating point
        INT8,      // 8-bit signed integer
        UINT8,     // 8-bit unsigned integer
        INT16     // 16-bit signed integer (less common)
    };

    /**
     * Parse quantization type from string
     */
    QuantizationType parseQuantizationType(const std::string& type_str);


    /**
     * Preprocessing steps enumeration
     */
    enum class PreprocessingStepEnum {
        Resize,
        Normalize,
        Crop,
        CenterCrop,
        Pad,
        ChannelsLast,
        StackChannels,
    };

} // namespace aiml

#endif // AIML_TYPES_H
