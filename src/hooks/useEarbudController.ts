import { useState, useEffect, useCallback } from 'react';
import { EarbudState, EarbudModel, AncMode, EqPreset, CustomEqSettings, AppTheme, GestureConfig } from '../models/types';
import { webSerialManager } from '../services/bluetooth/WebSerialManager';
import { earbudSimulator } from '../services/simulator/EarbudSimulator';
import { soundFx } from '../services/audio/SoundSynthesizer';

export function useEarbudController() {
  const [isSimulator, setIsSimulator] = useState<boolean>(true);
  const [state, setState] = useState<EarbudState>(() => earbudSimulator.getState());
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('app_theme') as AppTheme) || 'nothing-dark';
  });
  const [error, setError] = useState<string | null>(null);

  // Subscribe to active provider
  useEffect(() => {
    const activeService = isSimulator ? earbudSimulator : webSerialManager;
    const unsubscribe = activeService.subscribe(newState => {
      setState(newState);
    });
    return () => unsubscribe();
  }, [isSimulator]);

  // Update theme class on HTML element
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-pokedex', 'theme-cyberpunk', 'theme-lofi');

    if (theme === 'nothing-dark') {
      root.classList.add('dark');
    } else if (theme === 'pokemon-pokedex') {
      root.classList.add('theme-pokedex');
    } else if (theme === 'cyberpunk-neon') {
      root.classList.add('theme-cyberpunk');
    } else if (theme === 'lofi-vibes') {
      root.classList.add('theme-lofi');
    }
  }, [theme]);

  // Play tactile sound on theme changes
  const changeTheme = useCallback((newTheme: AppTheme) => {
    if (newTheme === 'pokemon-pokedex') {
      soundFx.playRetroBlip();
    } else {
      soundFx.playClick(900);
    }
    setTheme(newTheme);
  }, []);

  // Connect to real Bluetooth hardware
  const connectBluetooth = useCallback(async () => {
    setError(null);
    soundFx.playClick(1000);
    try {
      setIsSimulator(false);
      await webSerialManager.connect();
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setError(err.message || 'Failed to connect via Bluetooth');
      }
      setIsSimulator(true);
    }
  }, []);

  const disconnectBluetooth = useCallback(async () => {
    soundFx.playClick(600);
    await webSerialManager.disconnect();
    setIsSimulator(true);
  }, []);

  const toggleSimulator = useCallback((simMode: boolean) => {
    soundFx.playClick(850);
    setIsSimulator(simMode);
  }, []);

  const setModel = useCallback((model: EarbudModel) => {
    soundFx.playClick(750);
    if (isSimulator) {
      earbudSimulator.setModel(model);
    }
  }, [isSimulator]);

  const setAncMode = useCallback((mode: AncMode) => {
    soundFx.playClick(mode === 'off' ? 500 : mode === 'transparency' ? 700 : 900);
    if (isSimulator) {
      earbudSimulator.setAncMode(mode);
    } else {
      webSerialManager.setAncMode(mode);
    }
  }, [isSimulator]);

  const setPersonalizedAnc = useCallback((enabled: boolean) => {
    soundFx.playClick(enabled ? 850 : 600);
    if (isSimulator) {
      earbudSimulator.setPersonalizedAnc(enabled);
    }
  }, [isSimulator]);

  const setEqPreset = useCallback((preset: EqPreset) => {
    soundFx.playClick(800);
    if (isSimulator) {
      earbudSimulator.setEqPreset(preset);
    } else {
      webSerialManager.setEqPreset(preset);
    }
  }, [isSimulator]);

  const setCustomEq = useCallback((eq: CustomEqSettings) => {
    if (isSimulator) {
      earbudSimulator.setCustomEq(eq);
    } else {
      webSerialManager.setCustomEq(eq);
    }
  }, [isSimulator]);

  const setParametricEqBand = useCallback((index: number, band: Partial<EarbudState['parametricEq'][0]>) => {
    if (isSimulator) {
      earbudSimulator.setParametricEqBand(index, band);
    }
  }, [isSimulator]);

  const setUltraBass = useCallback((enabled: boolean, level?: number) => {
    soundFx.playClick(enabled ? 650 : 450);
    if (isSimulator) {
      earbudSimulator.setUltraBass(enabled, level);
    } else {
      webSerialManager.setUltraBass(enabled, level);
    }
  }, [isSimulator]);

  const setInEarDetection = useCallback((enabled: boolean) => {
    soundFx.playClick(enabled ? 800 : 550);
    if (isSimulator) {
      earbudSimulator.setInEarDetection(enabled);
    } else {
      webSerialManager.setInEarDetection(enabled);
    }
  }, [isSimulator]);

  const setLowLagMode = useCallback((enabled: boolean) => {
    soundFx.playClick(enabled ? 950 : 600);
    if (isSimulator) {
      earbudSimulator.setLowLagMode(enabled);
    } else {
      webSerialManager.setLowLagMode(enabled);
    }
  }, [isSimulator]);

  const setDualConnection = useCallback((enabled: boolean) => {
    soundFx.playClick(enabled ? 800 : 550);
    if (isSimulator) {
      earbudSimulator.setDualConnection(enabled);
    }
  }, [isSimulator]);

  const setGesture = useCallback((ear: 'left' | 'right', trigger: keyof GestureConfig, action: GestureConfig[keyof GestureConfig]) => {
    soundFx.playClick(750);
    if (isSimulator) {
      earbudSimulator.setGesture(ear, trigger, action);
    }
  }, [isSimulator]);

  const toggleRinging = useCallback((ear: 'left' | 'right') => {
    const isCurrentlyRinging = state.ringing[ear];
    soundFx.playClick(isCurrentlyRinging ? 400 : 1200);

    if (isCurrentlyRinging) {
      soundFx.stopRinging(ear);
      if (isSimulator) earbudSimulator.setRinging(ear, false);
      else webSerialManager.ringBud(ear, false);
    } else {
      soundFx.startRinging(ear);
      if (isSimulator) earbudSimulator.setRinging(ear, true);
      else webSerialManager.ringBud(ear, true);
    }
  }, [state.ringing, isSimulator]);

  return {
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
    setParametricEqBand,
    setUltraBass,
    setInEarDetection,
    setLowLagMode,
    setDualConnection,
    setGesture,
    toggleRinging,
  };
}

