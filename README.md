# Ear (OS) — Nothing & CMF Buds Companion

<p align="center">
  <img src="/public/assets/anc_on_icon.svg" width="80" height="80" alt="Ear (OS) Logo" />
</p>

<p align="center">
  <strong>Cross-platform Desktop & Web companion application for Nothing & CMF audio products.</strong><br>
  Engineered with authentic Nothing OS aesthetics, real-time Bluetooth SPP communication, full audio & ANC controls, and secret Pokémon Easter-egg themes.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Web-black?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/Framework-React%2018%20%2B%20Vite%20%2B%20TypeScript-blue?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Style-Nothing%20OS%20Dot--Matrix-red?style=for-the-badge" alt="Style" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 🚀 Key Features

### 🎧 Complete Hardware Control Suite
- **Active Noise Cancellation (ANC)**:
  - 3-State Master Selector: **Noise Cancellation**, **Transparency**, and **Off**.
  - 4 Intensity Modes: **High**, **Mid**, **Low**, and **Adaptive / Smart ANC**.
  - **Personalized ANC** toggle adapted to individual ear canal geometry.
  - **Ear Tip Fit Test** calibration diagnostic.
- **Studio Equalizer**:
  - 4 Tuned Presets: **Balanced**, **More Bass**, **More Treble**, and **Voice**.
  - **Custom 3-Band Graphic EQ** with live SVG frequency response curve.
  - **Audition Sound Button**: Auditions your custom tuning in real time using the Web Audio API synthesizer.
  - **Ultra Bass Technology**: Dynamic low-end sub-bass enhancement (Levels 1 to 5).
- **Custom Gestures & Pinch Controls**:
  - Independent mapping for **Left** and **Right** earbuds.
  - Single Tap / Pinch, Double Tap, Triple Tap, Tap & Hold, and Double Tap & Hold.
  - Configurable actions: Play/Pause, Next Track, Previous Track, Voice Assistant, Volume Up/Down, Noise Control Toggle.
- **Device & Power Status**:
  - Real-time battery gauges for **Left Earbud**, **Right Earbud**, and **Charging Case**.
  - Active charging indicator badges (`CHG`).
  - Serial number and firmware version inspector.
- **Advanced Settings**:
  - **In-Ear Detection**: Automatic pause when removed, resume when reinserted.
  - **Low Lag Mode**: Reduces Bluetooth latency down to sub-120ms for gaming and video.
  - **Dual Connection**: Multipoint management across two host devices.
  - **Find My Earbuds**: Loud multi-frequency radar sirens to locate lost buds.

---

## 🎮 Secret Pokémon Easter-Egg Themes
Did you know? **Nothing's audio engineering team secretly names all earbud hardware projects after Pokémon!**

Ear (OS) features a built-in **Pokédex Archive Mode**:
- **8-Bit Dot-Matrix Theme**: Classic GameBoy green LCD styling (`#8bac0f`) with CRT scanline textures.
- **Animated Pixel Sprites**: Shows the animated companion corresponding to your connected earbuds:
  - **Nothing Ear (2024)**: *Entei* (#244)
  - **Nothing Ear (a)**: *Cleffa* (#173)
  - **CMF Buds Pro 2**: *Espeon* (#196)
  - **Nothing Ear (2)**: *Lugia* / *Darkrai* (#249 / #491)
  - **Nothing Ear (stick)**: *Togepi* (#175)
  - **Nothing Ear (1)**: *Mew* (#151)
  - **CMF Buds Pro**: *Corsola* (#222)
  - **CMF Buds**: *Donphan* (#232)
  - **CMF Neckband Pro**: *Crobat* (#169)
  - **Nothing Ear (open)**: *Flaaffy* (#180)
- **8-Bit Sound FX**: Retro chimes and cries synthesized via Web Audio API.
- **Spec Battle Cards**: HP mapped to Battery, Noise Shield mapped to ANC dB, and Speed mapped to Latency.

---

## 💻 Cross-Platform Compatibility

| Operating System | Browser Support | Native Desktop Mode |
| :--- | :--- | :--- |
| **Windows 10 / 11** | Google Chrome, Microsoft Edge, Brave, Opera, Arc | ✅ Standalone App Window (`run-desktop.bat`) |
| **macOS (Intel & Apple Silicon)** | Google Chrome, Brave, Edge, Arc | ✅ Chromium PWA / Desktop App |
| **Linux (Ubuntu, Arch, Fedora)** | Google Chrome, Brave, Chromium | ✅ Native Desktop Window (`npm start`) |
| **ChromeOS / Android** | Chrome | ✅ Web App & PWA Install |

> **Note**: Bluetooth communication uses the standard **Web Serial API** (Bluetooth Serial Port Profile / SPP) on Chromium browsers without requiring custom drivers or administrator privileges.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm installed.

### Quick Run (Web Development Server)
```bash
# Clone repository
git clone https://github.com/qwertiian/nothing-buds-webapp.git
cd nothing-buds-webapp

# Install dependencies
npm install

# Start local dev server
npm run dev
```

### Launch as Standalone Desktop App
On Windows, simply double-click **`run-desktop.bat`**, or run:
```bash
npm run build
npm start
```
This starts the local runner and launches the application in dedicated native desktop window mode (`--app`).

---

## 🛠️ Project Architecture

```
nothing-buds-webapp/
├── public/
│   ├── assets/              # Device renders (Ear 1, 2, (a), CMF Buds), icons, ANC graphics
│   ├── fonts/               # Authentic Nothing fonts: NDOT 55, Space Grotesk, Lettera Mono
│   └── manifest.json        # PWA configuration
├── src/
│   ├── components/
│   │   ├── anc/             # AncStudio, Noise Cancellation, Fit Test
│   │   ├── battery/         # BatteryCard with animated circular SVG gauges
│   │   ├── connection/      # BluetoothModal and pairing instructions
│   │   ├── device/          # DeviceShowcase with 3D floating perspective renders
│   │   ├── eq/              # EqualizerStudio, Custom 3-Band EQ, Ultra Bass
│   │   ├── gestures/        # GestureStudio and tap/pinch mapping
│   │   ├── layout/          # Navbar, Model Quick Switcher, Theme Switcher
│   │   ├── settings/        # In-Ear Detection, Low Lag Mode, Find My Buds
│   │   └── themes/          # PokemonCompanion 8-bit Pokédex card & sound FX
│   ├── hooks/
│   │   └── useEarbudController.ts  # Master hook uniting simulator and hardware
│   ├── models/
│   │   ├── devices.ts       # Registry of Nothing/CMF models and Pokémon codenames
│   │   └── types.ts         # EarbudState, AncMode, EqPreset, GestureAction
│   ├── services/
│   │   ├── audio/           # SoundSynthesizer (clicks, chirps, 8-bit sounds)
│   │   ├── bluetooth/       # WebSerialManager (Bluetooth SPP stream handler)
│   │   ├── protocol/        # NothingProtocol (Framing, CRC-16, command decoders)
│   │   └── simulator/       # EarbudSimulator (100% offline responsive simulation)
│   ├── styles/
│   │   ├── fonts.css        # Font-face declarations
│   │   └── index.css        # Tailwind and Nothing OS design tokens
│   ├── App.tsx              # Master Application Layout
│   └── main.tsx             # React DOM entry point
├── desktop-launcher.js      # Cross-platform native window launcher
├── run-desktop.bat          # 1-Click Windows launcher
└── package.json
```

---

## 🤝 Contributing & Community
Issues, model requests, and pull requests are welcomed!
- GitHub Repository: [https://github.com/qwertiian/nothing-buds-webapp](https://github.com/qwertiian/nothing-buds-webapp)

*Disclaimer: This is an unofficial, community-driven open-source project. Nothing and CMF are trademarks of Nothing Technology Limited.*

