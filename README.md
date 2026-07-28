# Lyra — App React Native (CLI, sans Expo)

Chat IA + génération d'images propulsés par **Hugging Face Inference API**.
Le serveur, c'est Hugging Face — l'app appelle directement leurs endpoints depuis le téléphone.

## Fonctionnalités

- **Chat "Mamie Lyra"** avec mémoire persistante (AsyncStorage).
- **Génération d'images** via un modèle text-to-image HF (FLUX par défaut).
- **Écran Réglages** pour changer le token HF, les modèles et la personnalité, sans recompiler.
- **100% React Native CLI** (pas d'Expo). Tu compiles ton propre APK.

## Prérequis (sur ta machine)

- **Node.js ≥ 18** et **npm** (ou yarn)
- **JDK 17** (Adoptium/Temurin recommandé)
- **Android Studio** (SDK 34+ installé)
- Variables d'environnement Android : `ANDROID_HOME` pointant vers le SDK
- Un token Hugging Face : https://huggingface.co/settings/tokens
  (déjà pré-rempli dans `src/config.ts`, tu peux le changer dans l'app)

## Installation

```bash
cd LyraNative
npm install
# ou : yarn
```

## Lancement en développement (Metro + Android)

```bash
# 1) démarre Metro dans un terminal
npm start

# 2) dans un autre terminal, lance l'app sur un émulateur/téléphone branché
npm run android
```

## Construire l'APK toi-même

### APK debug (rapide, non signée-prod)

```bash
cd android
./gradlew assembleDebug
# APK ici : android/app/build/outputs/apk/debug/app-debug.apk
```

Ou raccourci depuis la racine du projet :

```bash
npm run apk:debug
```

### APK release (signée avec le debug keystore par défaut — à remplacer pour publication)

```bash
cd android
./gradlew assembleRelease
# APK ici : android/app/build/outputs/apk/release/app-release.apk
```

Pour une vraie release Play Store, génère ton propre keystore puis configure
`android/app/build.gradle` (section `signingConfigs.release`) et
`android/gradle.properties` avec tes credentials. Voir :
https://reactnative.dev/docs/signed-apk-android

### Ouvrir dans Android Studio

`File → Open…` → sélectionne le dossier `LyraNative/android`, puis
`Build → Build Bundle(s)/APK(s) → Build APK(s)`.

## Structure du projet

```
LyraNative/
├── App.tsx                       # Racine, tabs Chat / Image / Réglages
├── index.js                      # Entrée RN
├── src/
│   ├── config.ts                 # Token HF & modèles par défaut
│   ├── api/huggingface.ts        # Appels chat completions + image gen
│   ├── storage/memory.ts         # Historique + settings persistants
│   └── screens/
│       ├── ChatScreen.tsx
│       ├── ImageScreen.tsx
│       └── SettingsScreen.tsx
├── android/                      # Projet Android (Gradle)
├── ios/                          # Projet iOS (Xcode)
└── package.json
```

## Modèles Hugging Face

Par défaut :

- **Chat** : `meta-llama/Llama-3.2-3B-Instruct` (via `router.huggingface.co/v1/chat/completions`)
- **Image** : `black-forest-labs/FLUX.1-schnell` (via `api-inference.huggingface.co/models/...`)

Tu peux les remplacer depuis l'onglet **Réglages** de l'app (persisté).
Modèles alternatifs : `mistralai/Mistral-7B-Instruct-v0.3`, `Qwen/Qwen2.5-7B-Instruct`,
`stabilityai/stable-diffusion-xl-base-1.0`, etc. — vérifie qu'ils sont
supportés par les **Inference Providers** sur leur page HF.

## Personnalité "Mamie"

Le prompt système par défaut fait parler l'assistante comme une grand-mère
bienveillante ("mon petit", tutoiement, chaleureux). Modifiable dans
**Réglages → Personnalité**.

## Dépannage

- **`SDK location not found`** → crée `android/local.properties` avec
  `sdk.dir=/chemin/vers/Android/sdk`
- **`Unable to load script`** → assure-toi que Metro tourne (`npm start`)
  ou que l'APK release contient bien le bundle (déjà géré par le plugin RN Gradle).
- **Erreur HF 401** → token invalide → change-le dans **Réglages**.
- **Erreur HF 503 "Model is loading"** → le modèle se réveille, réessaie
  après 10–20 secondes.
- **Erreur HF 402/429** → quota gratuit HF dépassé, patiente ou utilise un
  autre modèle / un token Pro.

## Publier sur GitHub

```bash
cd LyraNative
git init
git add .
git commit -m "Initial commit — Lyra React Native CLI"
git branch -M main
git remote add origin https://github.com/<toi>/<repo>.git
git push -u origin main
```
