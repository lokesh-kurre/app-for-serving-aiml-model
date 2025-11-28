package com.aimlmodelapp

import android.app.Application
import android.content.Context
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, /* native exopackage */ false)
    }

    private val host: ReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean =
            BuildConfig.DEBUG

        override fun getPackages(): MutableList<ReactPackage> {
            val packages = PackageList(this).packages
            packages.add(AimlPackage())   // <-- your native module
            return packages
        }

        override fun getJSMainModuleName(): String = "index"
    }
}
