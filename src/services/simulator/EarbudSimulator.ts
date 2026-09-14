import { EarbudModel, EarbudState, AncMode, EqPreset, CustomEqSettings, GestureConfig } from '../../models/types';
import { SUPPORTED_DEVICES } from '../../models/devices';

const DEFAULT_GESTURES: { left: GestureConfig; right: GestureConfig } = {
  left: {
    singleTap: 'play_pause',
    doubleTap: 'next_track',
    tripleTap: 'previous_track',
    tapAndHold: 'anc_cycle',
    doubleTapAndHold: 'voice_assistant',
  },
  right: {
    singleTap: 'play_pause',
    doubleTap: 'next_track',
    tripleTap: 'previous_track',
    tapAndHold: 'anc_cycle',
    doubleTapAndHold: 'volume_up',
  },
};

export class EarbudSimulator {
  private state: EarbudState;
  private listeners: Array<(state: EarbudState) => void> = [];
  private drainInterval: number | null = null;

  constructor(initialModel: EarbudModel = SUPPORTED_DEVICES[0]) {
    const savedModelId = localStorage.getItem('sim_model_id');
    const model = (savedModelId ? SUPPORTED_DEVICES.find(d => d.id === savedModelId) : null) || initialModel;

    this.state = {
      connected: true,
      isConnecting: false,
      isSimulator: true,
      model,
      battery: {
        left: 88,
        right: 92,
        case: 75,
        leftCharging: false,
        rightCharging: false,
        caseCharging: false,
      },
      ancMode: model.hasAnc ? 'high' : 'off',
      personalizedAnc: false,
      eqPreset: 'balanced',
      customEq: { bass: 2, mid: 0, treble: 1 },
      parametricEq: [
        { freq: 32, gain: 2.5, q: 1.2 },
        { freq: 64, gain: 1.8, q: 1.0 },
        { freq: 125, gain: 0.5, q: 1.0 },
        { freq: 250, gain: 0.0, q: 1.0 },
        { freq: 1000, gain: -0.5, q: 1.0 },
        { freq: 4000, gain: 1.5, q: 1.4 },
        { freq: 8000, gain: 2.0, q: 1.2 },
        { freq: 16000, gain: 1.0, q: 1.0 },
      ],
      ultraBass: { enabled: true, level: 3 },
      inEarDetection: true,
      lowLagMode: false,
      dualConnection: true,
      firmwareVersion: '1.0.182',
      serialNumber: 'SH2469019248271',
      gestures: DEFAULT_GESTURES,
      ringing: { left: false, right: false },
    };

    this.startBatterySimulation();
  }

  public getState(): EarbudState {
    return { ...this.state };
  }

  public subscribe(listener: (state: EarbudState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(l => l(s));
  }

  private startBatterySimulation() {
    if (this.drainInterval) clearInterval(this.drainInterval);

    // Very slow natural fluctuation
    this.drainInterval = window.setInterval(() => {
      if (this.state.connected) {
        this.state = {
          ...this.state,
          battery: {
            ...this.state.battery,
            left: Math.max(10, this.state.battery.left - (Math.random() > 0.8 ? 1 : 0)),
            right: Math.max(10, this.state.battery.right - (Math.random() > 0.85 ? 1 : 0)),
          }
        };
        this.notify();
      }
    }, 45000);
  }

  public setModel(model: EarbudModel) {
    localStorage.setItem('sim_model_id', model.id);
    this.state = {
      ...this.state,
      model,
      ancMode: model.hasAnc ? this.state.ancMode : 'off',
      serialNumber: `${model.baseId}24${model.sku}918234`,
    };
    this.notify();
  }

  public setAncMode(mode: AncMode) {
    if (!this.state.model.hasAnc && mode !== 'off') return;
    this.state = { ...this.state, ancMode: mode };
    this.notify();
  }

  public setPersonalizedAnc(enabled: boolean) {
    this.state = { ...this.state, personalizedAnc: enabled };
    this.notify();
  }

  public setEqPreset(preset: EqPreset) {
    this.state = { ...this.state, eqPreset: preset };
    this.notify();
  }

  public setCustomEq(eq: CustomEqSettings) {
    this.state = {
      ...this.state,
      eqPreset: 'custom',
      customEq: { ...eq }
    };
    this.notify();
  }

  public setParametricEqBand(index: number, band: Partial<EarbudState['parametricEq'][0]>) {
    const updated = [...this.state.parametricEq];
    updated[index] = { ...updated[index], ...band };
    this.state = {
      ...this.state,
      eqPreset: 'advanced',
      parametricEq: updated
    };
    this.notify();
  }

  public setUltraBass(enabled: boolean, level?: number) {
    this.state = {
      ...this.state,
      ultraBass: {
        enabled,
        level: level !== undefined ? level : this.state.ultraBass.level,
      }
    };
    this.notify();
  }

  public setInEarDetection(enabled: boolean) {
    this.state = { ...this.state, inEarDetection: enabled };
    this.notify();
  }

  public setLowLagMode(enabled: boolean) {
    this.state = { ...this.state, lowLagMode: enabled };
    this.notify();
  }

  public setDualConnection(enabled: boolean) {
    this.state = { ...this.state, dualConnection: enabled };
    this.notify();
  }

  public setGesture(ear: 'left' | 'right', trigger: keyof GestureConfig, action: GestureConfig[keyof GestureConfig]) {
    this.state = {
      ...this.state,
      gestures: {
        ...this.state.gestures,
        [ear]: {
          ...this.state.gestures[ear],
          [trigger]: action,
        }
      }
    };
    this.notify();
  }

  public setRinging(ear: 'left' | 'right', ringing: boolean) {
    this.state = {
      ...this.state,
      ringing: {
        ...this.state.ringing,
        [ear]: ringing,
      }
    };
    this.notify();
  }
}

export const earbudSimulator = new EarbudSimulator();
