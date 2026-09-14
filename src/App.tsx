import React, { useState } from 'react';
import { useEarbudController } from './hooks/useEarbudController';
import { Navbar } from './components/layout/Navbar';
import { DeviceShowcase } from './components/device/DeviceShowcase';
import { BatteryCard } from './components/battery/BatteryCard';
import { AncStudio } from './components/anc/AncStudio';
import { EqualizerStudio } from './components/eq/EqualizerStudio';
import { GestureStudio } from './components/gestures/GestureStudio';
import { DeviceSettings } from './components/settings/DeviceSettings';
import { PokemonCompanion } from './components/themes/PokemonCompanion';
import { BluetoothModal } from './components/connection/BluetoothModal';
import { Sliders, Volume2, Gamepad2, Sparkles, Settings, Github, ExternalLink, Download } from 'lucide-react';

export function App() {
  const {
    state,
    theme,
    isSimulator,
    error,
    changeTheme,
    connectBluetooth,
    disconnectBluetooth,
    toggleSimulator,
    setModel,
    setAncMode,
    setPersonalizedAnc,
    setEqPreset,
    setCustomEq,
    setUltraBass,
    setInEarDetection,
    setLowLagMode,
    setDualConnection,
    setGesture,
    toggleRinging,
  } = useEarbudController();

  const [activeTab, setActiveTab] = useState<'controls' | 'eq' | 'gestures' | 'settings' | 'pokemon'>('controls');
  const [showConnectModal, setShowConnectModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col selection:bg-nothing-red selection:text-white relative">
      {/* Top Navigation */}
      <Navbar
        theme={theme}
        onThemeChange={changeTheme}
        isSimulator={isSimulator}
        onToggleSimulator={toggleSimulator}
        isConnected={state.connected}
        isConnecting={state.isConnecting}
        onConnect={() => setShowConnectModal(true)}
        onDisconnect={disconnectBluetooth}
        activeModel={state.model}
        onSelectModel={setModel}
        error={error}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* Top Hero: Device Showcase */}
        <DeviceShowcase
          model={state.model}
          serialNumber={state.serialNumber}
          firmwareVersion={state.firmwareVersion}
          onSelectModel={setModel}
          isSimulator={isSimulator}
        />

        {/* Battery Gauges */}
        <BatteryCard battery={state.battery} />

        {/* Studio Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-white/10 bg-[#121212] overflow-x-auto">
          <button
            onClick={() => setActiveTab('controls')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ${
              activeTab === 'controls'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Noise Control</span>
          </button>

          <button
            onClick={() => setActiveTab('eq')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ${
              activeTab === 'eq'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Equalizer</span>
          </button>

          <button
            onClick={() => setActiveTab('gestures')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ${
              activeTab === 'gestures'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Gestures</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Device Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('pokemon')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ml-auto ${
              activeTab === 'pokemon'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pokédex Companion</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="w-full">
          {activeTab === 'controls' && (
            <AncStudio
              ancMode={state.ancMode}
              onSetAncMode={setAncMode}
              personalizedAnc={state.personalizedAnc}
              onSetPersonalizedAnc={setPersonalizedAnc}
              model={state.model}
            />
          )}

          {activeTab === 'eq' && (
            <EqualizerStudio
              eqPreset={state.eqPreset}
              onSetEqPreset={setEqPreset}
              customEq={state.customEq}
              onSetCustomEq={setCustomEq}
              ultraBass={state.ultraBass}
              onSetUltraBass={setUltraBass}
              model={state.model}
            />
          )}

          {activeTab === 'gestures' && (
            <GestureStudio
              gestures={state.gestures}
              onSetGesture={setGesture}
              model={state.model}
            />
          )}

          {activeTab === 'settings' && (
            <DeviceSettings
              state={state}
              onSetInEarDetection={setInEarDetection}
              onSetLowLagMode={setLowLagMode}
              onSetDualConnection={setDualConnection}
              onToggleRinging={toggleRinging}
            />
          )}

          {activeTab === 'pokemon' && (
            <PokemonCompanion
              model={state.model}
              state={state}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-[#0d0d0d] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-ndot text-sm text-white">EAR (OS)</span>
            <span>—</span>
            <span>Unofficial Desktop & Web Companion for Nothing & CMF Buds</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/qwertiian/nothing-buds-webapp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
          </div>
        </div>
      </footer>

      {/* Bluetooth Connect Modal */}
      <BluetoothModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={() => {
          connectBluetooth();
          setShowConnectModal(false);
        }}
        isConnecting={state.isConnecting}
        error={error}
        onUseSimulator={() => toggleSimulator(true)}
      />
    </div>
  );
}
