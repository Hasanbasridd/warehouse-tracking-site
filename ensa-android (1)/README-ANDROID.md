# ENSA Stok — Android (Capacitor)
Bu şablonla web uygulamanı Android'e paketleyip Play Store'a yükleyebilirsin.

## Gerekenler
- Node.js (LTS)
- Android Studio (SDK ile)
- Google Play Console hesabı

## Adımlar
```bash
cd ensa-android
npm install
npm run android   # android platformunu ekler ve Android Studio'yu açar
```
Android Studio açılınca:
1) `app/src/main/AndroidManifest.xml` içine izin ekleyin:
```xml
<uses-permission android:name="android.permission.CAMERA" />
```
2) Çalıştır (Run).
3) Yayın: **Build > Generate Signed Bundle** ile `.aab` üretin.

Not: Uygulama içeriği `www/index.html` dosyasındadır.
