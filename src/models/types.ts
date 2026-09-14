export type AncMode = 'off' | 'transparency' | 'low' | 'mid' | 'high' | 'adaptive';

export type EqPreset = 'balanced' | 'bass' | 'treble' | 'voice' | 'custom' | 'advanced';

export type GestureAction = 
  | 'none'
  | 'play_pause'
  | 'next_track'
  | 'previous_track'
  | 'voice_assistant'
  | 'volume_up'
  | 'volume_down'
  | 'anc_cycle';

export interface GestureConfig {
  singleTap: GestureAction;
  doubleTap: GestureAction;
  tripleTap: GestureAction;
  tapAndHold: GestureAction;
  doubleTapAndHold: GestureAction;
}

export interface CustomEqSettings {
  bass: number; // -6 to +6 dB
  mid: number;
  treble: number;
}

export interface ParametricEqBand {
  freq: number; // Hz
  gain: number; // -12 to +12 dB
  q: number;    // 0.1 to 10.0
}

export interface EarbudModel {
  id: string;
  name: string;
  codename: string; // internal Nothing codename
  pokemonName: string;
  pokemonDexNumber: number;
  pokemonType: string[];
  pokemonSpriteUrl?: string;
  pokemonFunFact: string;
  baseId: string;
  sku: string;
  leftImg: string;
  rightImg: string;
  caseImg: string;
  duoImg?: string;
  hasAnc: boolean;
  maxAncDb?: number;
  hasAdvancedEq: boolean;
  hasUltraBass: boolean;
  hasPersonalizedAnc: boolean;
  hasEarFitTest: boolean;
  hasCaseLedColor?: boolean;
}

export interface EarbudState {
  connected: boolean;
  isConnecting: boolean;
  isSimulator: boolean;
  model: EarbudModel;
  battery: {
    left: number;
    right: number;
    case: number;
    leftCharging: boolean;
    rightCharging: boolean;
    caseCharging: boolean;
  };
  ancMode: AncMode;
  personalizedAnc: boolean;
  eqPreset: EqPreset;
  customEq: CustomEqSettings;
  parametricEq: ParametricEqBand[];
  ultraBass: {
    enabled: boolean;
    level: number; // 1-5
  };
  inEarDetection: boolean;
  lowLagMode: boolean;
  dualConnection: boolean;
  firmwareVersion: string;
  serialNumber: string;
  gestures: {
    left: GestureConfig;
    right: GestureConfig;
  };
  ringing: {
    left: boolean;
    right: boolean;
  };
}

export type AppTheme = 
  | 'nothing-dark' 
  | 'nothing-light' 
  | 'pokemon-pokedex' 
  | 'cyberpunk-neon' 
  | 'lofi-vibes';
