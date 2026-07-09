# Expo Prebuild Guide

## What is Expo Prebuild?

Expo prebuild is a feature that generates native Android and iOS projects from your Expo configuration. It bridges the gap between the managed workflow and the bare workflow, giving you:

- **Managed convenience**: Configure your app through `app.json`/`app.config.js`
- **Native flexibility**: Access to native code when needed
- **Reproducible builds**: Generate consistent native projects

## How It Works

### 1. Configuration-Driven Generation
Your `app.json` file serves as the single source of truth for native project configuration:

```json
{
  "expo": {
    "name": "my-app",
    "slug": "my-app",
    "version": "1.0.0",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.umairshaik.myapp"
    },
    "android": {
      "package": "com.umairshaik.myapp",
      "edgeToEdgeEnabled": true
    }
  }
}
```

### 2. Native Project Generation
When you run `npx expo prebuild`, Expo:
- Creates `android/` and `ios/` directories
- Generates platform-specific files (Gradle, Xcode project files)
- Configures native dependencies based on your installed Expo modules
- Sets up build scripts and configurations

## Key Commands

### Generate Native Projects
```bash
npx expo prebuild
```

### Clean Regeneration
```bash
npx expo prebuild --clean
```
This deletes existing native folders and regenerates them completely.

### Platform-Specific Generation
```bash
npx expo prebuild --platform android
npx expo prebuild --platform ios
```

### Skip Dependency Installation
```bash
npx expo prebuild --no-install
```

## Current Project Status

❌ **Native folders not generated**: Run `npx expo prebuild` (or `yarn prebuild`) to generate native projects (`android/`, `ios/`).
✅ **Configuration applied**: Your `app.json` settings are reflected in native projects
✅ **Dependencies configured**: React Native and Expo modules are properly set up

### Generated Structure:

**Android:**
- `android/app/` - Main application code
- `android/build.gradle` - Build configuration
- `android/gradle.properties` - Gradle settings
- `android/settings.gradle` - Project settings

**iOS:**
- `ios/myapp/` - Main application code
- `ios/myapp.xcodeproj/` - Xcode project files
- `ios/Podfile` - CocoaPods dependencies
- `ios/.xcode.env` - Xcode environment configuration

## When to Use Prebuild

### ✅ Perfect For:
- Starting with managed workflow but need native customization later
- Teams that want configuration-driven development
- Projects needing reproducible builds across environments
- Gradual migration from managed to bare workflow

### ❌ Not Ideal For:
- Heavy native customizations that can't be configured through Expo
- Projects with complex native build processes
- Apps requiring immediate native code access

## Benefits Demonstrated

1. **From Scratch Generation**: We just deleted your native folders and regenerated them completely
2. **Configuration Consistency**: All settings from `app.json` are automatically applied
3. **Dependency Management**: Expo handles native dependency linking automatically
4. **Build Reproducibility**: Anyone can regenerate the same native projects

## Next Steps

### Running Your App
```bash
# Start development server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

### Making Changes
1. **Configuration changes**: Update `app.json` and run `npx expo prebuild --clean`
2. **Adding dependencies**: Install with npm/yarn, then run prebuild to update native projects
3. **Native customization**: Modify files in `android/` and `ios/` directly (but be aware they'll be overwritten on clean prebuild)

### Best Practices
- Always commit `app.json` changes
- Use `--clean` when you want a fresh start
- Document any manual native modifications
- Consider using Expo config plugins for complex native customizations

This demonstrates how Expo prebuild creates a powerful bridge between managed simplicity and native flexibility!