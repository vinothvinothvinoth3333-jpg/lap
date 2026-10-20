# University Laboratory Management

University laboratory booking and management application with an Android wrapper powered by Capacitor.

## Android app identity and branding

- App name: `Lab Manager`
- Android application ID: `com.university.labmanagement`
- Branded vector launcher icon and splash screen are in `android/app/src/main/res/`.
- Web/PWA icon artwork is `public/icon.svg`; the 512x512 Play Store icon is `public/play-store-icon.png`.

The application ID must be globally unique in Google Play. Replace the provisional `com.university.labmanagement` with the university's owned reverse-domain ID **before the first Play Store upload** if the university has an official domain/package convention. Once published, an app's application ID cannot be changed for that listing.

## Build and sync Android assets

Install the project dependencies, build the static web app, and copy it into the Android project:

```bash
pnpm install
pnpm build
npx cap sync android
```

Open the project in Android Studio:

```bash
npx cap open android
```

Android builds require JDK 17 or newer and the Android SDK. Android Studio can install/manage these.

## Create a signed Play Store bundle

1. From the `android` directory, create a private upload keystore. Keep the generated keystore and passwords backed up securely:

   ```powershell
   keytool -genkeypair -v -keystore app\release-upload-key.jks -alias lab-manager-upload -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Copy `android/keystore.properties.example` to `android/keystore.properties`. Set the store password, key alias, and key password to the values you created. The properties file and `*.jks`/`*.keystore` files are ignored by Git.
3. Build the Android App Bundle from the repository root:

   ```powershell
   cd android
   .\gradlew.bat bundleRelease
   ```

   The signed bundle is created at `android/app/build/outputs/bundle/release/app-release.aab`. The release task stops with an explicit error if local signing settings are missing.
4. Enroll the app in Google Play App Signing, then upload the AAB in Play Console and complete the store listing, content rating, privacy/data-safety, and testing requirements.

Never commit the upload keystore, signing properties, or passwords. Keep a secure backup: losing the upload key can delay future updates.

## Before publishing

This project is still a prototype, not yet a production-ready staff app. The current login uses demo credentials and client-side logic, and the screens use sample data rather than a production authentication/database service. Do not publish it for real staff use until authentication and authorization are enforced by a secured backend, real data handling is connected, and the privacy/data-safety disclosures match actual behavior.

## Web development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
