package com.aimlmodelapp

import android.content.ContentUris
import android.content.ContentValues
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import com.facebook.react.bridge.*
import java.io.*

class MediaStoreSaverModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "MediaStoreSaver"

    // --- SAVE IMAGE INTO Pictures/AIMLModelApp ---
    @ReactMethod
    fun saveImage(path: String, promise: Promise) {
        try {
            val file = File(path)
            if (!file.exists()) {
                promise.reject("ENOENT", "File not found")
                return
            }

            val filename = "IMG_${System.currentTimeMillis()}.png"

            val resolver = reactContext.contentResolver
            val contentValues = ContentValues().apply {
                put(MediaStore.Images.Media.DISPLAY_NAME, filename)
                put(MediaStore.Images.Media.MIME_TYPE, "image/png")
                put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/AIMLModelApp")
            }

            val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues)
            if (uri == null) {
                promise.reject("EWRITE", "Insert failed")
                return
            }

            resolver.openOutputStream(uri).use { out ->
                FileInputStream(file).use { input -> input.copyTo(out!!) }
            }

            val map = Arguments.createMap()
            map.putString("uri", uri.toString())
            map.putString("filename", filename)

            promise.resolve(map)

        } catch (e: Exception) {
            promise.reject("EFAIL", e.message)
        }
    }

    // --- SAVE OR APPEND METADATA.JSONL ---
    @ReactMethod
    fun appendMetadata(jsonlLine: String, promise: Promise) {
        try {
            val filename = "metadata.jsonl"
            val resolver = reactContext.contentResolver
            val relativePath = "Download/AIMLModelApp"   // <- use Download (not Pictures)

            // Try to find existing file
            val projection = arrayOf(MediaStore.MediaColumns._ID)
            val selection = "${MediaStore.MediaColumns.RELATIVE_PATH}=? AND ${MediaStore.MediaColumns.DISPLAY_NAME}=?"
            val selectionArgs = arrayOf("$relativePath/", filename) // note the trailing slash for RELATIVE_PATH

            var existingUri: Uri? = null
            resolver.query(
                MediaStore.Downloads.getContentUri("external"),
                projection,
                selection,
                selectionArgs,
                null
            )?.use { cursor ->
                if (cursor.moveToFirst()) {
                    val id = cursor.getLong(0)
                    existingUri = ContentUris.withAppendedId(MediaStore.Downloads.getContentUri("external"), id)
                }
            }

            val fileUri: Uri = existingUri ?: run {
                val values = ContentValues().apply {
                    put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                    put(MediaStore.MediaColumns.MIME_TYPE, "text/plain")
                    put(MediaStore.MediaColumns.RELATIVE_PATH, "$relativePath")
                }
                resolver.insert(MediaStore.Downloads.getContentUri("external"), values)
                    ?: throw IOException("Failed to create metadata.jsonl")
            }

            // open in append mode ("wa")
            resolver.openOutputStream(fileUri, "wa").use { out ->
                out?.write((jsonlLine + "\n").toByteArray(Charsets.UTF_8))
            }

            promise.resolve(fileUri.toString())
        } catch (e: Exception) {
            promise.reject("EMETA", e.message)
        }
    }
}
