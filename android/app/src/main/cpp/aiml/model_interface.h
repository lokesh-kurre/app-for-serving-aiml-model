    #ifndef AIML_MODEL_INTERFACE_H
    #define AIML_MODEL_INTERFACE_H

    #include "types.h"
    #include <string>
    #include <vector>

    namespace aiml {

    /**
     * Abstract interface for AI/ML model inference with integrated preprocessing
     * This allows pluggable backends (TFLite, ONNX Runtime, etc.)
     *
     * Standard Flow: User data → Convert to ImageData → Preprocess → Quantize → Backend Inference
     */
        class ModelInterface {
        public:
            virtual ~ModelInterface() = default;

            /**
             * Initialize model with configuration
             * @param config Model configuration including path, quantization, and preprocessing
             * @return true if successful, false otherwise
             */
            virtual bool initialize() = 0;

            /**
             * Run inference on raw image data with integrated preprocessing
             * This is the main entry point for inference.
             * Flow: ImageData → Preprocess (resize/crop/normalize) → Quantize → Backend inference
             *
             * @param input Raw image data in HWC format (any size)
             * @return Output tensor data from the model
             */
            virtual TensorData<float> inference(const ImageData<uint8_t>& input) = 0;

            /**
             * Get input tensor shape expected by the model
             * @return Vector of dimensions [batch, height, width, channels] or [batch, channels, height, width]
             */
            virtual std::vector<int> getInputShape() const = 0;

            /**
             * Get output tensor shape
             * @return Vector of dimensions
             */
            virtual std::vector<int> getOutputShape() const = 0;

            /**
             * Check if model is loaded and ready
             * @return true if model is loaded and ready for inference
             */
            virtual bool isLoaded() const = 0;

            /**
             * Get quantization type used by the model
             * @return Quantization type
             */
            virtual QuantizationType getQuantizationType() const = 0;
        };

    /**
     * Factory function type for creating model instances
     */
        using ModelFactory = ModelInterface* (*)();

    /**
     * Model registry for managing different backend implementations
     */
        class ModelRegistry {
        public:
            /**
             * Register a model backend
             * @param name Backend name (e.g., "tflite", "onnx")
             * @param factory Factory function to create model instances
             */
            static void registerBackend(const std::string& name, ModelFactory factory);

            /**
             * Load a model instance for a specific backend
             * @param name Backend name
             * @return Model instance or nullptr if backend not found
             */
            static ModelInterface* loadModel(const std::string& name);

            /**
             * Get list of registered backends
             * @return Vector of backend names
             */
            static std::vector<std::string> getAvailableBackends();
        };

    } // namespace aiml

    #endif // AIML_MODEL_INTERFACE_H
