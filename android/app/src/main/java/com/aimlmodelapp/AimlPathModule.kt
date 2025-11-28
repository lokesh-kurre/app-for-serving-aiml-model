package com.aimlmodelapp

import android.graphics.BitmapFactory
import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AimlPathModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AimlPathModule"

    @ReactMethod
    fun decodeToBase64(path: String, promise: Promise) {
        try {
            val bmp = BitmapFactory.decodeFile(path)
                ?: throw Exception("Failed to decode image at $path")

            val w = bmp.width
            val h = bmp.height

            val pixels = IntArray(w * h)
            bmp.getPixels(pixels, 0, w, 0, 0, w, h)

            val rgb = ByteArray(w * h * 3)
            var idx = 0
            for (p in pixels) {
                rgb[idx++] = ((p shr 16) and 0xFF).toByte() // R
                rgb[idx++] = ((p shr 8) and 0xFF).toByte()  // G
                rgb[idx++] = (p and 0xFF).toByte()          // B
            }

            val b64 = Base64.encodeToString(rgb, Base64.NO_WRAP)

            val map = com.facebook.react.bridge.Arguments.createMap()
            map.putString("base64", b64)
            map.putInt("width", w)
            map.putInt("height", h)
            map.putInt("channels", 3)
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("DECODE_ERR", e.localizedMessage ?: "decode failed")
        }
    }
}
