#include <jsi/jsi.h>

using namespace facebook;

extern jsi::Value aimlLoadModel(jsi::Runtime&, const jsi::Value*, size_t);
extern jsi::Value aimlInference(jsi::Runtime&, const jsi::Value*, size_t);

extern "C"
void installAiml(jsi::Runtime& rt) {
    auto& global = rt.global();

    global.setProperty(
            rt,
            "aimlLoadModel",
            jsi::Function::createFromHostFunction(
                    rt,
                    jsi::PropNameID::forAscii(rt, "aimlLoadModel"),
                    1,
                    aimlLoadModel
            )
    );

    global.setProperty(
            rt,
            "aimlInference",
            jsi::Function::createFromHostFunction(
                    rt,
                    jsi::PropNameID::forAscii(rt, "aimlInference"),
                    4,
                    aimlInference
            )
    );
    global.setProperty(
            rt,
            "aimlInferenceFromBuffer",
            jsi::Function::createFromHostFunction(
                    rt,
                    jsi::PropNameID::forAscii(rt, "aimlInferenceFromBuffer"),
                    4,
                    aimlInference
            )
    );
}
