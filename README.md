# Totem App — React Front‑End

This repository contains a React Native prototype of **Totem App**.  The goal of
the project is to provide a modern front‑end built with React that talks to
Firebase for authentication, uses the device’s GPS and a map view to track
friends, and embeds a **Godot** AR scene to display an on‑screen totem when
users need augmented‑reality guidance.  Only the AR functionality uses Godot;
the rest of the user interface runs in React Native.

## Features

* **Time‑limited GPS tracking:** The app requests the device’s GPS location and
  subscribes to updates.  A timer can be started to enable tracking for a
  limited duration.  Godot’s GPS plugin shows how you might implement this on
  the engine side — its `EnableGPS()` method starts location tracking and
  emits an `onLocationUpdates` signal that returns a dictionary containing
  `latitude`, `longitude`, `accuracy`, `altitude` and other fields for every
  update【297930607786020†L320-L361】.  We replicate this behaviour in
  JavaScript using the `Geolocation` API and `react-native-permissions`.

* **Friend locator:** Friends can be invited via their email or social logins
  and will appear on the map when they share their location.  The map itself
  is implemented using the `react-native-maps` library.  Friends are drawn as
  markers on the map; clicking a marker displays the friend’s name.

* **Authentication:** Users can log in with Google, Facebook or an email
  address using Firebase Auth.  The GodotFirebase plugin demonstrates
  authentication endpoints such as `signup_with_email_and_password`,
  `login_with_email_and_password` and OAuth login【661707396329274†L185-L238】.
  In this React implementation we use `@react-native-firebase/auth` to
  authenticate users.  You will need to create a Firebase project and enable
  the relevant sign‑in providers in the Firebase Console.

* **Augmented reality totem:** When users tap the AR tab the app opens a
  Godot scene using the `react-native‑godot` library.  The AR module is the
  only part of Totem App that runs in Godot.  Godot communicates back to
  React via the `onMessage` callback.  To anchor the totem to a real‑world
  location you can use ARCore’s Geospatial API; it uses Google’s Visual
  Positioning System and Street View imagery to determine accurate WGS84
  coordinates for your AR content【409158624729938†L646-L661】.

## Getting Started

### 1. Install dependencies

Make sure you have React Native’s CLI and development environment set up
(Node.js, Android Studio and Xcode).  Install the npm dependencies:

```bash
yarn install
# or
npm install
```

### 2. Configure Firebase

Create a Firebase project and enable Email, Google and Facebook sign‑in.  Copy
the `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
configuration files into the respective platform folders in `android/` and
`ios/`.  Follow the [React Native Firebase setup guide](https://rnfirebase.io/)
for more details.

### 3. Generate and import your Godot AR module

The AR functionality is implemented in the `totem_app` Godot project located
in the root of this repository.  To embed it into the React app you need to
generate a **PCK** file and import it as an asset.  The `react-native‑godot`
documentation provides the following workflow:

1. Add an `export_presets.cfg` file to your Godot project and configure an
   Android export preset.  A working example of this file can be found in
   the `react-native‑godot` repository【636210009572298†L220-L233】.
2. Run the helper script `./gen-pck PROJECT_FOLDER_PATH` to build a `.pck`
   package containing your project’s assets and scripts【636210009572298†L234-L238】.
3. Move the generated `.pck` file into the React app’s `assets` folder and
   reference it using `require` in your AR screen (see
   `src/screens/ArScreen.tsx`).
4. Update your `metro.config.js` so that the bundler treats `.pck` files as
   assets and sets the correct `Content‑Type`.  The recommended
   configuration extends the asset extensions list and installs a custom
   middleware to set the content type for `.pck` files【636210009572298†L245-L266】.

### 4. Running the app

After completing the above steps you can start the development server:

```bash
yarn start

# In a separate terminal build and run on Android
yarn android

# (Optional) Run on iOS if you have a Mac
yarn ios
```

## Project Structure

```
totem_app_react/
├── package.json         # Project metadata and dependencies
├── README.md            # This file
├── assets/              # Place your exported Godot .pck file here
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context
│   ├── screens/
│   │   ├── LoginScreen.tsx      # Login and registration UI
│   │   ├── MapScreen.tsx        # GPS tracking and map view
│   │   ├── ArScreen.tsx         # Godot AR view
│   │   └── FriendsScreen.tsx    # Friends list and invitations
│   └── App.tsx                  # Root component and navigation
└── metro.config.js      # Metro bundler configuration (to be created)
```

## Notes on GPS and AR

* The PraxisMapper GPS plugin for Godot makes it clear that GPS tracking does
  not require Google Play Services【297930607786020†L263-L267】.  If you need
  high‑accuracy location or altitude information you can call Godot’s
  `EnableGPS()` method and listen for the `onLocationUpdates` signal, which
  returns latitude, longitude, accuracy and other data fields【297930607786020†L320-L361】.  In
  this React implementation we use the built‑in `Geolocation` API, but you
  could also implement a native module that relays Godot’s GPS plugin
  information back to JavaScript.

* For authentication, the GodotFirebase plugin exposes functions to create
  users, sign in with email/password and perform OAuth login【661707396329274†L185-L238】.  In
  React we achieve the same functionality through Firebase Auth’s JavaScript
  SDK; the code in `LoginScreen.tsx` demonstrates email/password and Google
  login flows.

* When implementing the AR view you can anchor virtual totems using
  ARCore’s Geospatial API.  This API uses Google’s Visual Positioning System
  and Street View imagery to deliver precise WGS84 coordinates for AR
  content【409158624729938†L646-L661】.  You can call this API from your
  Godot AR scene via a custom Android plugin or rely on ARCore’s internal
  support in Godot 4.4.

## Limitations

* The `react-native‑godot` library currently has full support for iOS and
  is actively working on Android support (see the library’s README).  If
  Android support is not yet available by the time you run this project you
  may need to build Godot as an Android library manually.  Godot’s GPS
  plugin and Firebase authentication will still function independently of
  React.

* This project is a prototype and does not include a backend for storing
  friend relationships or location histories.  You will need to integrate
  a database service such as Firestore or your own API to handle friend
  invitations, accepted friendships and location sharing.
