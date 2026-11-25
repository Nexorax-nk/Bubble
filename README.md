# Bubble 🫧
> **Speak your language. Connect with anyone.**

Bubble is a personal AI translation companion and interpreter for travelers. Designed for natural, two-way cross-lingual communication on a single device, Bubble combines tactile 3D visuals, real-time speech translation, and instant voice playback.

---

## ✨ Key Features

- **🌐 Multi-Language Live Translation**: Instant translation across 14+ global languages including English, Japanese, Spanish, Hindi, French, German, Mandarin Chinese, Korean, and Italian.
- **🎙️ 3D Glossy Voice Sphere & Harmonic Equalizer**:
  - Tactile 3D sphere with multi-stop radial highlights and ambient teal glow.
  - Organic rolling harmonic sine-wave equalizer visualizer active in both standby and listening states.
- **💬 Real-Time Two-Way Conversation Mode**:
  - Dialogue feed with distinct speaker tags, country flags, and speech bubbles.
  - Turn-switching logic supporting back-and-forth conversational exchanges.
  - Manual text input fallback with instant translation.
- **🔊 Spoken Audio Synthesis (TTS)**:
  - Integrated with `expo-speech` for high-quality voice audio playback.
  - One-tap replay on every message card and an optional auto-play toggle.
- **✨ Fluid Shared-Element Mic Glide Transition**:
  - A cinematic 650ms bezier shared-element transition (`bezier(0.22, 1, 0.36, 1)`).
  - The 3D mic sphere glides smoothly from the home center down into the conversation dock while scaling down.
  - Curtain-parting effect where top cards slide up and bottom bars slide down.
- **👤 Traveler Profile Dashboard**:
  - Custom panoramic landscape banner (`profile banner.png`).
  - Native tongue and country selection with flag emojis.
  - Travel statistics, account settings, and avatar customization.
- **📖 Smart Travel Phrasebook & Shortcuts**:
  - Quick action shortcuts for Type, Camera, and Travel Phrases.
  - Searchable travel phrase dictionary for dining, directions, shopping, and emergencies.
- **📱 Responsive Calibration**:
  - Adaptive scaling anchored to standard device baselines (Oppo A52 360dp, Pixel 9a 412dp).
  - Safe area inset handling for notch and navigation gestures.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 58](https://expo.dev/)
- **Styling & Gradients**: `expo-linear-gradient`
- **Vector Graphics**: `react-native-svg`
- **Speech Synthesis**: `expo-speech`
- **Safe Area Management**: `react-native-safe-area-context`
- **Architecture**: Monorepo with npm workspaces (`apps/mobile`)

---

## 📂 Project Structure

```text
Bubble/
├── apps/
│   └── mobile/
│       ├── assets/               # Brand logos, 3D spheres, illustrations & banners
│       │   ├── home/             # 3D microphone sphere & Fuji graphics
│       │   └── onboarding/       # Onboarding illustrations & profile banner
│       ├── App.js                # Root navigation & interactive onboarding carousel
│       ├── ConversationScreen.js # Real-time dialogue screen & TTS voice engine
│       ├── Illustration.js       # Scalable SVG scene illustrations
│       ├── ProfileScreen.js      # Traveler profile dashboard & banner view
│       ├── ProfileSetup.js       # First-time traveler onboarding & language picker
│       ├── TranslatorHome.js     # Main translation hub & shared-element transitions
│       ├── app.json              # Expo application configuration
│       └── package.json          # Mobile dependencies & scripts
├── BUBBLE_PROJECT_GUIDE.md       # Product design specifications & development guide
├── package.json                  # Root workspace manifest
└── README.md                     # Project overview and documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Expo Go app on your Android device (or Android Emulator / Web Browser)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nexorax-nk/Bubble.git
   cd Bubble
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

- **Start Expo Development Server**:
  ```bash
  npm run mobile
  ```
  Scan the QR code in your terminal with the Expo Go app on Android.

- **Web / Computer Preview**:
  ```bash
  cd apps/mobile
  npx expo start --web
  ```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
