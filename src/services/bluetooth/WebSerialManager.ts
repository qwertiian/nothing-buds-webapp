import { 
  COMMANDS, 
  RESPONSE_COMMANDS, 
  buildPacket, 
  extractCommand, 
  parseBattery, 
  parseAnc, 
  ancModeToByte, 
  parseEq, 
  eqPresetToByte, 
  buildCustomEqPayload, 
  parseFirmware, 
  parseSerial 
} from '../protocol/NothingProtocol';
import { EarbudModel, EarbudState, AncMode, EqPreset, CustomEqSettings } from '../../models/types';
import { SUPPORTED_DEVICES, findModelBySku } from '../../models/devices';

export class WebSerialManager {
  private port: any = null;
  private reader: any = null;
  private writer: any = null;
  private isReading: boolean = false;
  private opId: number = 0;
  private listeners: Array<(state: EarbudState) => void> = [];

  private state: EarbudState = {
    connected: false,
    isConnecting: false,
    isSimulator: false,
    model: SUPPORTED_DEVICES[0],
    battery: {
      left: 100,
      right: 100,
      case: 100,
      leftCharging: false,
      rightCharging: false,
      caseCharging: false,
    },
    ancMode: 'off',
    personalizedAnc: false,
    eqPreset: 'balanced',
    customEq: { bass: 0, mid: 0, treble: 0 },
    parametricEq: [],
    ultraBass: { enabled: false, level: 3 },
    inEarDetection: true,
    lowLagMode: false,
    dualConnection: true,
    firmwareVersion: '',
    serialNumber: '',
    gestures: {
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
    },
    ringing: { left: false, right: false },
  };

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
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

  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Web Serial API is not supported in this browser. Please use Chrome, Edge, Brave, or Opera.');
    }

    const SPP_UUID = 'aeac4a03-dff5-498f-843a-34487cf133eb';
    const FASTPAIR_UUID = 'df21fe2c-2515-4fdb-8886-f12c4d67927c';

    this.state.isConnecting = true;
    this.notify();

    try {
      const serial = (navigator as any).serial;
      this.port = await serial.requestPort({
        allowedBluetoothServiceClassIds: [SPP_UUID, FASTPAIR_UUID],
        filters: [{ bluetoothServiceClassId: SPP_UUID }, { bluetoothServiceClassId: FASTPAIR_UUID }],
      });

      await this.port.open({ baudRate: 9600 });
      this.state.connected = true;
      this.state.isConnecting = false;
      this.notify();

      this.startReading();
      this.initializeDevice();
      return true;
    } catch (err) {
      this.state.connected = false;
      this.state.isConnecting = false;
      this.notify();
      throw err;
    }
  }

  public async disconnect() {
    this.isReading = false;
    if (this.reader) {
      try {
        await this.reader.cancel();
        this.reader.releaseLock();
      } catch {
        // ignore
      }
      this.reader = null;
    }
    if (this.port) {
      try {
        await this.port.close();
      } catch {
        // ignore
      }
      this.port = null;
    }
    this.state.connected = false;
    this.notify();
  }

  private async sendCommand(command: number, payload: number[] = []) {
    if (!this.port || !this.port.writable) return;
    this.opId = (this.opId + 1) % 255;
    const packet = buildPacket(command, payload, this.opId);

    try {
      this.writer = this.port.writable.getWriter();
      await this.writer.write(packet.buffer);
      this.writer.releaseLock();
      this.writer = null;
    } catch (err) {
      if (this.writer) {
        try { this.writer.releaseLock(); } catch {}
        this.writer = null;
      }
    }
  }

  private async initializeDevice() {
    // Read serial number to detect model
    await this.sendCommand(COMMANDS.READ_SERIAL);
    await new Promise(r => setTimeout(r, 120));

    await this.sendCommand(COMMANDS.READ_BATTERY);
    await new Promise(r => setTimeout(r, 120));

    await this.sendCommand(COMMANDS.READ_ANC);
    await new Promise(r => setTimeout(r, 120));

    await this.sendCommand(COMMANDS.READ_EQ);
    await new Promise(r => setTimeout(r, 120));

    await this.sendCommand(COMMANDS.READ_FIRMWARE);
    await new Promise(r => setTimeout(r, 120));

    await this.sendCommand(COMMANDS.READ_IN_EAR);
    await new Promise(r => setTimeout(r, 120));

    await this.sendCommand(COMMANDS.READ_LATENCY);
  }

  private async startReading() {
    if (!this.port || !this.port.readable) return;
    this.isReading = true;

    try {
      this.reader = this.port.readable.getReader();
      while (this.isReading) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value && value.length >= 8) {
          const raw = new Uint8Array(value.buffer || value);
          if (raw[0] === 0x55) {
            this.handlePacket(raw);
          }
        }
      }
    } catch (err) {
      // Stream error / disconnected
    } finally {
      if (this.reader) {
        try { this.reader.releaseLock(); } catch {}
        this.reader = null;
      }
      this.state.connected = false;
      this.notify();
    }
  }

  private handlePacket(raw: Uint8Array) {
    const cmd = extractCommand(raw);

    switch (cmd) {
      case RESPONSE_COMMANDS.SERIAL_RESP: {
        const serial = parseSerial(raw);
        if (serial) {
          this.state.serialNumber = serial;
          const sku = serial.substring(4, 6);
          const detectedModel = findModelBySku(sku);
          this.state.model = detectedModel;
          this.notify();
        }
        break;
      }
      case RESPONSE_COMMANDS.BATTERY_RESP_1:
      case RESPONSE_COMMANDS.BATTERY_RESP_2: {
        const bat = parseBattery(raw);
        this.state.battery = bat;
        this.notify();
        break;
      }
      case RESPONSE_COMMANDS.ANC_RESP_1:
      case RESPONSE_COMMANDS.ANC_RESP_2: {
        const anc = parseAnc(raw);
        this.state.ancMode = anc;
        this.notify();
        break;
      }
      case RESPONSE_COMMANDS.EQ_RESP_1:
      case RESPONSE_COMMANDS.EQ_RESP_2: {
        const eq = parseEq(raw);
        this.state.eqPreset = eq;
        this.notify();
        break;
      }
      case RESPONSE_COMMANDS.FIRMWARE_RESP: {
        const fw = parseFirmware(raw);
        this.state.firmwareVersion = fw;
        this.notify();
        break;
      }
      case RESPONSE_COMMANDS.IN_EAR_RESP: {
        if (raw.length > 10) {
          this.state.inEarDetection = raw[10] === 1;
          this.notify();
        }
        break;
      }
      case RESPONSE_COMMANDS.LATENCY_RESP: {
        if (raw.length > 8) {
          this.state.lowLagMode = raw[8] === 1;
          this.notify();
        }
        break;
      }
    }
  }

  // Control Methods
  public async setAncMode(mode: AncMode) {
    this.state.ancMode = mode;
    this.notify();
    const byte = ancModeToByte(mode);
    await this.sendCommand(COMMANDS.SET_ANC, [0x01, byte, 0x00]);
  }

  public async setEqPreset(preset: EqPreset) {
    this.state.eqPreset = preset;
    this.notify();
    const byte = eqPresetToByte(preset);
    await this.sendCommand(COMMANDS.SET_EQ, [byte, 0x00]);
  }

  public async setCustomEq(eq: CustomEqSettings) {
    this.state.eqPreset = 'custom';
    this.state.customEq = eq;
    this.notify();
    const payload = buildCustomEqPayload(eq);
    await this.sendCommand(COMMANDS.SET_CUSTOM_EQ, payload);
  }

  public async setUltraBass(enabled: boolean, level: number = 3) {
    this.state.ultraBass = { enabled, level };
    this.notify();
    await this.sendCommand(COMMANDS.SET_ENHANCED_BASS, [enabled ? 0x01 : 0x00, level * 2]);
  }

  public async setInEarDetection(enabled: boolean) {
    this.state.inEarDetection = enabled;
    this.notify();
    await this.sendCommand(COMMANDS.SET_IN_EAR, [0x01, 0x01, enabled ? 0x01 : 0x00]);
  }

  public async setLowLagMode(enabled: boolean) {
    this.state.lowLagMode = enabled;
    this.notify();
    await this.sendCommand(COMMANDS.SET_LATENCY, [enabled ? 0x01 : 0x02, 0x00]);
  }

  public async ringBud(ear: 'left' | 'right', ring: boolean) {
    this.state.ringing[ear] = ring;
    this.notify();
    const budByte = ear === 'left' ? 0x02 : 0x03;
    await this.sendCommand(COMMANDS.SET_RING_BUDS, [budByte, ring ? 0x01 : 0x00]);
  }
}

export const webSerialManager = new WebSerialManager();
