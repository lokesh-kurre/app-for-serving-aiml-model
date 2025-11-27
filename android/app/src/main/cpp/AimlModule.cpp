#include <jsi/jsi.h>
#include <string>
#include <cstring>
#include "aiml/model_interface.h"
#include "aiml/types.h"

using namespace facebook;

static aiml::ModelInterface* g_model = nullptr;

jsi::Value aimlLoadModel(jsi::Runtime& rt, const jsi::Value* args, size_t count) {
    if (count < 1 || !args[0].isString()) {
        throw jsi::JSError(rt, "aimlLoadModel(name) requires string");
    }

    std::string backend = args[0].asString(rt).utf8(rt);

    g_model = aiml::ModelRegistry::loadModel(backend);
    if (!g_model) {
        throw jsi::JSError(rt, "Failed to load model backend");
    }

    if (!g_model->initialize()) {
        throw jsi::JSError(rt, "Model initialization failed");
    }

    return jsi::Value(true);
}

jsi::Value aimlInference(jsi::Runtime& rt, const jsi::Value* args, size_t count) {
    if (!g_model || !g_model->isLoaded()) {
        throw jsi::JSError(rt, "Model not loaded");
    }

    if (count < 4) {
        throw jsi::JSError(rt, "aimlInference(data, w, h, c)");
    }

    // Uint8Array buffer → ArrayBuffer
    jsi::Object bufObj = args[0].asObject(rt);
    jsi::ArrayBuffer buf = bufObj.getArrayBuffer(rt);

    int w = args[1].asNumber();
    int h = args[2].asNumber();
    int c = args[3].asNumber();

    aiml::ImageData<uint8_t> img(w, h, c);
    std::memcpy(img.data.data(), buf.data(rt), buf.size(rt));

    aiml::TensorData<float> out = g_model->inference(img);

    jsi::Array arr(rt, out.data.size());
    for (size_t i = 0; i < out.data.size(); i++) {
        arr.setValueAtIndex(rt, i, jsi::Value(out.data[i]));
    }

    return arr;
}
