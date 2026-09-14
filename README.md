# Ear (OS) — Nothing & CMF Buds Desktop & Web Companion

<p align="center">
  <img src="https://raw.githubusercontent.com/qwertiian/nothing-buds-webapp/main/public/assets/anc_on_icon.svg" width="90" height="90" alt="Ear (OS) Logo" />
</p>

<p align="center">
  <strong>The unofficial, full-featured desktop companion for Nothing & CMF earbuds.</strong><br>
  Control your earbuds directly from your PC without ever touching your phone.
</p>

<p align="center">
  <a href="https://nothing-buds-webapp.vercel.app/">
    <img src="https://img.shields.io/badge/LIVE%20APP-nothing--buds--webapp.vercel.app-d71920?style=for-the-badge&logo=vercel&logoColor=white" alt="Live App" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Web-black?style=flat-square" alt="Platforms" />
  <img src="https://img.shields.io/badge/Protocol-Bluetooth%20SPP%20RFCOMM-blue?style=flat-square" alt="Protocol" />
  <img src="https://img.shields.io/badge/PWA-Installable%20Desktop%20App-purple?style=flat-square" alt="PWA" />
  <img src="https://img.shields.io/badge/Design-Nothing%20OS%20Dot--Matrix-red?style=flat-square" alt="Design" />
  <img src="https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Private-green?style=flat-square" alt="Privacy" />
</p>

---

## 🌐 Launch & Install Directly

You don't need to clone any repositories or install software dependencies. Launch and install directly from your browser:

### 👉 **[Open Ear (OS) Live Web App](https://nothing-buds-webapp.vercel.app/)**

### 💻 How to Install as a Standalone Windows Desktop App:
1. Open **[https://nothing-buds-webapp.vercel.app/](https://nothing-buds-webapp.vercel.app/)** in **Google Chrome**, **Microsoft Edge**, or **Brave**.
2. Click the **`[ INSTALL APP ]`** button in the top banner or navigation bar (or click the **Install icon** `[📥/🖥️]` on the right side of your browser's address bar).
3. Click **"Install"** in the browser prompt.
4. **Done!** Ear (OS) launches immediately in its own **dedicated, borderless window**, pins to your **Windows Taskbar**, and adds a shortcut to your **Desktop** and **Start Menu**.

---

## ❓ Why Ear (OS)? The Problem It Solves

Nothing and CMF make some of the best wireless earbuds in the world. However, **Nothing does not offer an official desktop application for Windows, macOS, or Linux.**

When working, gaming, or attending video meetings on your PC:
- ❌ You have to unlock your phone and launch the mobile app just to switch noise cancellation modes.
- ❌ You cannot check earbud and case battery levels from your desktop.
- ❌ You cannot adjust equalizer presets (e.g., boosting vocal clarity for a Teams call or increasing bass for Spotify) without reaching for your phone.

**Ear (OS) solves this completely.** By utilizing the modern **Web Serial / Web Bluetooth SPP API**, Ear (OS) establishes a direct bidirectional hardware control link between your computer and your earbuds. Change settings on your desktop and the earbud hardware DSP registers update instantly.

---

## ✨ Core Features

### 🎧 Active Noise Cancellation (ANC)
- **3-Way Master Switch**: Seamlessly toggle between **Noise Cancellation**, **Transparency**, and **Off**.
- **4 Intensity Profiles**: Switch between **High**, **Mid**, **Low**, and **Adaptive Smart ANC**.
- **Personalized Hearing ANC**: Toggle custom algorithmic noise profiling adapted to individual ear geometry.
- **Hardware Synced**: No UI lag or snap-back — states are validated and locked on hardware.

### 🎛️ Studio Equalizer & DSP Curve
- **4 Master Presets**: **Balanced** (studio tuning), **More Bass** (+4dB punch), **More Treble** (crisp acoustic highs), and **Voice** (podcasts & calls).
- **Custom 3-Band Equalizer**: Live Bass, Mid, and Treble sliders that directly reflash earbud hardware DSP registers.
- **Live Curve Visualizer**: Real-time SVG frequency response curve graph reflecting your exact tuning.
- **Ultra Bass Technology**: Dynamic low-end sub-bass enhancement with adjustable wire intensity (Levels 1 to 5).
- **Audition Synthesizer**: Preview acoustic frequency profiles directly through Web Audio synthesis.

### 🔋 Real-Time Battery Gauges
- **Triple-Channel Battery Monitoring**: Dedicated circular gauges for **Left Earbud**, **Right Earbud**, and **Charging Case**.
- **Active Charging Status**: Visual `CHG` indicators when earbuds or case are actively charging.
- **Smart Case Memory**: Retains accurate case battery status even when earbuds are in-ear and the lid is closed.

### ⚙️ Hardware Settings & Diagnostics
- **In-Ear Detection**: Automatically pauses playback when an earbud is removed, resuming when reinserted.
- **Low Lag Mode**: Drops Bluetooth audio transmission latency to sub-120ms for competitive PC gaming and video sync.
- **Find My Earbuds**: Triggers alternating high-frequency radar beacon chimes on either bud to locate misplaced earbuds.
- **Firmware & Serial Inspector**: Displays hardware serial number and installed firmware version.

### 🎨 4 Dynamic UI Themes
Switch themes on the fly via the top navigation palette:
- 🔴 **Nothing Dark**: Iconic Nothing glyph red (`#d71920`), deep obsidian backgrounds (`#0a0a0a`), and dot-matrix typography.
- 🟢 **Pokédex 8-Bit**: Authentic retro Game Boy DMG green screen (`#8bac0f`) with CRT scanlines and synthesized 8-bit sound effects.
- 🟣 **Cyberpunk Neon**: High-contrast electric cyan (`#00f0ff`), neon magenta (`#ff007f`), and deep violet glass panels (`#0a0014`).
- ☕ **Lofi Vibes**: Warm cozy espresso (`#181412`), creamy parchment text (`#f5e6d3`), and mellow terracotta accents (`#e07a5f`).

### 👾 The Secret Pokédex Archive
Nothing's engineering team internally codenames their audio projects after Pokémon! Ear (OS) includes a dedicated **Pokédex Archive** that automatically pairs your connected model with its engineering codename:
- **CMF Buds 2**: *Donphan* (#232)
- **CMF Buds Pro 2**: *Espeon* (#196)
- **Nothing Ear (2024)**: *Entei* (#244)
- **Nothing Ear (a)**: *Cleffa* (#173)
- **Nothing Ear (2)**: *Lugia* (#249)
- **Nothing Ear (1)**: *Mew* (#151)
- **Nothing Ear (stick)**: *Togepi* (#175)
- **CMF Buds Pro**: *Corsola* (#222)
- **CMF Neckband Pro**: *Crobat* (#169)
- **Nothing Ear (open)**: *Flaaffy* (#180)

---

## 📱 Supported Devices

Ear (OS) supports the full range of Nothing & CMF Bluetooth audio devices:

| Device | Internal Codename | Max ANC | Ultra Bass | Graphic EQ |
| :--- | :--- | :---: | :---: | :---: |
| **CMF Buds 2** | *Donphan* | 42 dB | ✅ | ✅ |
| **CMF Buds Pro 2** | *Espeon* | 50 dB | ✅ | ✅ |
| **Nothing Ear (2024)** | *Entei* | 45 dB | ✅ | ✅ |
| **Nothing Ear (a)** | *Cleffa* | 45 dB | ✅ | ✅ |
| **Nothing Ear (2)** | *Lugia* | 40 dB | ❌ | ✅ |
| **Nothing Ear (1)** | *Mew* | 34 dB | ❌ | ✅ |
| **Nothing Ear (stick)** | *Togepi* | Half-in-ear | ❌ | ✅ |
| **CMF Buds** | *Donphan* | 42 dB | ✅ | ✅ |
| **CMF Buds Pro** | *Corsola* | 45 dB | ✅ | ✅ |
| **CMF Neckband Pro** | *Crobat* | 50 dB | ✅ | ✅ |
| **Nothing Ear (open)** | *Flaaffy* | Open-ear | ❌ | ✅ |

---

## 🔒 Privacy & Security

- **100% Client-Side**: Ear (OS) runs entirely inside your browser sandbox or standalone PWA container.
- **Zero Cloud Communication**: Your serial packets, device status, and equalizer curves never leave your local machine.
- **No Account / No Tracking**: No login, no analytics trackers, no advertising cookies.

---

## 🌐 Browser Compatibility

Ear (OS) uses the standard **Web Serial API** over Bluetooth Serial Port Profile (SPP):

| Browser | Windows | macOS | Linux | ChromeOS |
| :--- | :---: | :---: | :---: | :---: |
| **Google Chrome** | ✅ Supported | ✅ Supported | ✅ Supported | ✅ Supported |
| **Microsoft Edge** | ✅ Supported | ✅ Supported | ✅ Supported | ✅ Supported |
| **Brave** | ✅ Supported | ✅ Supported | ✅ Supported | ✅ Supported |
| **Opera / Opera GX** | ✅ Supported | ✅ Supported | ✅ Supported | ✅ Supported |

---

## 📄 License & Disclaimer

- **License**: Released under the [MIT License](LICENSE).
- **Disclaimer**: *Ear (OS) is an independent, community-driven open-source project. Nothing, CMF, and their respective logos are registered trademarks of Nothing Technology Limited. This project is not affiliated with, endorsed by, or sponsored by Nothing Technology Limited.*
