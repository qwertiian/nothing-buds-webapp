import { useState, useEffect, useCallback } from 'react';
import { EarbudState, EarbudModel, AncMode, EqPreset, CustomEqSettings, AppTheme, GestureConfig } from '../models/types';
import { webSerialManager } from '../services/bluetooth/WebSerialManager';
import { soundFx } from '../services/audio/SoundSynthesizer';

export function useEarbudController() {
  const [state, setState] = useState<EarbudState>(() => webSerialManager.getState());
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('app_theme') as AppTheme) || 'nothing-dark';
  });
  const [error, setError] = useState<string | null>(null);

  // Subscribe to WebSerialManager state updates
  useEffect(() => {
    const unsubscribe = webSerialManager.subscribe(newState => {
      setState(newState);
    });

    // Auto-detect and connect to already paired/granted buds on app startup
    if (webSerialManager.isSupported()) {
      webSerialManager.tryAutoConnect().catch(() => {});
    }

    return () => unsubscribe();
  }, []);

  // Update theme class on root element
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-nothing-dark', 'theme-pokedex', 'theme-cyberpunk', 'theme-lofi');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  // Play tactile audio feedback on theme changes
  const changeTheme = useCallback((newTheme: AppTheme) => {
    if (newTheme === 'pokemon-pokedex') {
      soundFx.playRetroBlip();
    } else {
      soundFx.playClick(900);
    }
    setTheme(newTheme);
  }, []);

  // Connect to real Bluetooth earbuds
  const connectBluetooth = useCallback(async () => {
    setError(null);
    soundFx.playClick(1000);
    try {
      await webSerialManager.connect();
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setError(err.message || 'Failed to connect via Bluetooth');
      }
    }
  }, []);

  const disconnectBluetooth = useCallback(async () => {
    soundFx.playClick(600);
    await webSerialManager.disconnect();
  }, []);

  const setModel = useCallback((model: EarbudModel) => {
    soundFx.playClick(750);
    webSerialManager.setModel(model);
  }, []);

  const setAncMode = useCallback((mode: AncMode) => {
    soundFx.playClick(mode === 'off' ? 500 : mode === 'transparency' ? 700 : 900);
    webSerialManager.setAncMode(mode);
  }, []);

  const setPersonalizedAnc = useCallback((enabled: boolean) => {
    soundFx.playClick(enabled ? 850 : 600);
    webSerialManager.setPersonalizedAnc(enabled);
  }, []);

  const setEqPreset = useCallback((preset: EqPreset) => {
    soundFx.playClick(800);
    webSerialManager.setEqPreset(preset);
  }, []);

  const setCustomEq = useCallback((eq: CustomEqSettings) => {
    webSerialManager.setCustomEq(eq);
  }, []);

  const setUltraBass = useCallback((enabled: boolean, level?: number) => {
    soundFx.playClick(enabled ? 650 : 450);
    webSerialManager.setUltraBass(enabled, level);
  }, []);

  const setInEarDetection = useCallback((enabled: boolean) => {
    soundFx.playClick(enabled ? 800 : 550);
    webSerialManager.setInEarDetection(enabled);
  }, []);

  const setLowLagMode = useCallback((enabled: boolean) => {
    soundFx.playClick(enabled ? 950 : 600);
    webSerialManager.setLowLagMode(enabled);
  }, []);

  const setDualConnection = useCallback((enabled: boolean) => {
    soundFx.playClick(enabled ? 800 : 550);
    setState(prev => ({ ...prev, dualConnection: enabled }));
  }, []);

  const setGesture = useCallback((ear: 'left' | 'right', trigger: keyof GestureConfig, action: GestureConfig[keyof GestureConfig]) => {
    soundFx.playClick(750);
    webSerialManager.setGesture(ear, trigger, action);
  }, []);

  const toggleRinging = useCallback((ear: 'left' | 'right') => {
    const isCurrentlyRinging = state.ringing[ear];
    soundFx.playClick(isCurrentlyRinging ? 400 : 1200);

    if (isCurrentlyRinging) {
      soundFx.stopRinging(ear);
      webSerialManager.ringBud(ear, false);
    } else {
      soundFx.startRinging(ear);
      webSerialManager.ringBud(ear, true);
    }
  }, [state.ringing]);

  return {
    state,
    theme,
    error,
    changeTheme,
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
    setGesture,
    toggleRinging,
  };
}
