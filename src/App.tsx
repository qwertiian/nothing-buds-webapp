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
import { Sliders, Volume2, Gamepad2, Sparkles, Settings, Github, ExternalLink } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col selection:bg-nothing-red selection:text-white relative font-sans">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
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
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-white/6 bg-[#111111] overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('controls')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono transition-all duration-200 whitespace-nowrap ${
              activeTab === 'controls'
                ? 'bg-white/10 text-white border-l-2 border-nothing-red shadow-sm'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Noise Control</span>
          </button>

          <button
            onClick={() => setActiveTab('eq')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono transition-all duration-200 whitespace-nowrap ${
              activeTab === 'eq'
                ? 'bg-white/10 text-white border-l-2 border-nothing-red shadow-sm'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Equalizer</span>
          </button>

          <button
            onClick={() => setActiveTab('gestures')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono transition-all duration-200 whitespace-nowrap ${
              activeTab === 'gestures'
                ? 'bg-white/10 text-white border-l-2 border-nothing-red shadow-sm'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Gestures</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono transition-all duration-200 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white/10 text-white border-l-2 border-nothing-red shadow-sm'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('pokemon')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono transition-all duration-200 whitespace-nowrap ml-auto ${
              activeTab === 'pokemon'
                ? 'bg-white/10 text-white border-l-2 border-nothing-red shadow-sm'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Pokédex</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="w-full transition-all duration-200">
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
      <footer className="w-full border-t border-white/6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>NOTHING OS DESKTOP COMPANION</span>
          <a
            href="https://github.com/qwertiian/nothing-buds-webapp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-all duration-200"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GITHUB</span>
          </a>
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
