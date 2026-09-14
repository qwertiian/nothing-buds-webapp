import React, { useState, useEffect } from 'react';
import { useEarbudController } from './hooks/useEarbudController';
import { Navbar } from './components/layout/Navbar';
import { DeviceShowcase } from './components/device/DeviceShowcase';
import { BatteryCard } from './components/battery/BatteryCard';
import { AncStudio } from './components/anc/AncStudio';
import { EqualizerStudio } from './components/eq/EqualizerStudio';
import { DeviceSettings } from './components/settings/DeviceSettings';
import { PokemonCompanion } from './components/themes/PokemonCompanion';
import { BluetoothModal } from './components/connection/BluetoothModal';
import { FirstTimePermissionsModal } from './components/onboarding/FirstTimePermissionsModal';
import { Sliders, Volume2, Sparkles, Settings, Github, ExternalLink, Bluetooth, ShieldCheck } from 'lucide-react';

export function App() {
  const {
    state,
    theme,
    error,
    changeTheme,
    prepareBluetoothRadio,
    connectBluetooth,
    disconnectBluetooth,
    setModel,
    setAncMode,
    setPersonalizedAnc,
    setEqPreset,
    setCustomEq,
    setUltraBass,
    setInEarDetection,
    setLowLagMode,
    setDualConnection,
    toggleRinging,
  } = useEarbudController();

  const [activeTab, setActiveTab] = useState<'controls' | 'eq' | 'settings' | 'pokemon'>('controls');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);

  // Check if first-time permission onboarding is needed
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('nothing_buds_permissions_granted');
    if (!hasSeenOnboarding && !state.connected) {
      setShowFirstTimeModal(true);
    }
  }, []);

  const handleOpenConnect = () => {
    prepareBluetoothRadio();
    setShowConnectModal(true);
  };

  const handleGrantFirstTime = () => {
    localStorage.setItem('nothing_buds_permissions_granted', 'true');
    setShowFirstTimeModal(false);
    handleOpenConnect();
  };

  const handleDismissFirstTime = () => {
    localStorage.setItem('nothing_buds_permissions_granted', 'dismissed');
    setShowFirstTimeModal(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col selection:bg-[var(--accent-color)] selection:text-white relative transition-colors duration-300">
      {/* Top Navigation Bar */}
      <Navbar
        theme={theme}
        onThemeChange={changeTheme}
        isConnected={state.connected}
        isConnecting={state.isConnecting}
        onConnect={handleOpenConnect}
        onDisconnect={disconnectBluetooth}
        activeModel={state.model}
        onSelectModel={setModel}
        error={error}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex flex-col gap-5">
        {/* Device Not Connected Banner */}
        {!state.connected && (
          <div className="w-full p-4 sm:p-5 rounded-2xl theme-card border-dashed flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--border-dim)] flex items-center justify-center text-[var(--accent-color)] shrink-0">
                {state.osBluetoothConnected ? <ShieldCheck size={22} className="text-cyan-400" /> : <Bluetooth size={20} />}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs sm:text-sm font-semibold text-[var(--text-main)]">
                  {state.osBluetoothConnected && state.systemDeviceName
                    ? `${state.systemDeviceName} Connected on Windows`
                    : 'Connect your Nothing or CMF Earbuds'}
                </span>
                <span className="text-[11px] font-mono text-[var(--text-sub)]">
                  {state.osBluetoothConnected && state.systemDeviceName
                    ? 'Device active on your PC. Click below to grant one-time permission to sync live ANC, EQ & battery levels.'
                    : 'Take your earbuds out of their case to connect, or click below to scan and pair.'}
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenConnect}
              disabled={state.isConnecting}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] hover:opacity-90 text-white font-mono text-xs font-semibold shadow-lg transition whitespace-nowrap"
            >
              {state.isConnecting 
                ? 'Connecting...' 
                : state.osBluetoothConnected && state.systemDeviceName 
                ? `Sync ${state.systemDeviceName}` 
                : 'Connect Buds Now'}
            </button>
          </div>
        )}

        {/* Device Showcase (Interactive 3D Renders) */}
        <DeviceShowcase
          model={state.model}
          serialNumber={state.serialNumber}
          firmwareVersion={state.firmwareVersion}
          onSelectModel={setModel}
          isConnected={state.connected}
          osBluetoothConnected={state.osBluetoothConnected}
          systemDeviceName={state.systemDeviceName}
        />

        {/* Battery Gauges */}
        <BatteryCard battery={state.battery} />

        {/* Studio Navigation Tabs (Gestures removed per user request) */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('controls')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ${
              activeTab === 'controls'
                ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-bold shadow'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--border-dim)]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Noise Control</span>
          </button>

          <button
            onClick={() => setActiveTab('eq')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ${
              activeTab === 'eq'
                ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-bold shadow'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--border-dim)]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Equalizer</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-bold shadow'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--border-dim)]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Device Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('pokemon')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ml-auto ${
              activeTab === 'pokemon'
                ? 'bg-[var(--accent-color)] text-white font-bold shadow'
                : 'text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pokédex Archive</span>
          </button>
        </div>

        {/* Tab Content Panels */}
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
      <footer className="w-full border-t border-[var(--border-dim)] bg-[var(--bg-app)] py-5 mt-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[var(--text-sub)]">
          <div className="flex items-center gap-2">
            <span className="font-ndot text-sm text-[var(--text-main)]">EAR (OS)</span>
            <span>—</span>
            <span>Desktop & Web Companion for Nothing & CMF Buds</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/qwertiian/nothing-buds-webapp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--text-main)] transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          </div>
        </div>
      </footer>

      {/* Bluetooth Connect Modal */}
      <BluetoothModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={() => {
          setShowConnectModal(false);
          connectBluetooth();
        }}
        isConnecting={state.isConnecting}
        error={error}
        detectedName={state.systemDeviceName}
      />

      {/* First-Time Setup Permissions Modal */}
      <FirstTimePermissionsModal
        isOpen={showFirstTimeModal}
        onGrant={handleGrantFirstTime}
        onDismiss={handleDismissFirstTime}
      />
    </div>
  );
}
