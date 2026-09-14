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
  parseSerial,
  GESTURE_TRIGGER_TO_BYTE,
  GESTURE_BYTE_TO_TRIGGER,
  GESTURE_ACTION_TO_BYTE,
  GESTURE_BYTE_TO_ACTION
} from '../protocol/NothingProtocol';
import { EarbudModel, EarbudState, AncMode, EqPreset, CustomEqSettings, GestureConfig, GestureAction } from '../../models/types';
import { SUPPORTED_DEVICES, findModelBySku, findModelByName } from '../../models/devices';

const SPP_UUID = 'aeac4a03-dff5-498f-843a-34487cf133eb';

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
    model: SUPPORTED_DEVICES.find(d => d.id === 'cmf_buds_pro_2_blue') || SUPPORTED_DEVICES[0],
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
    systemDeviceName: undefined,
    osBluetoothConnected: false,
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

  // Poll Windows/macOS paired Bluetooth devices
  public async syncWithSystemBluetooth(): Promise<string | null> {
    try {
      const res = await fetch('/api/bluetooth/devices');
      if (res.ok) {
        const devices = await res.json();
        if (Array.isArray(devices) && devices.length > 0) {
          const matched = devices.find(d => d.FriendlyName && !d.FriendlyName.includes('Avrcp'));
          const name = matched ? matched.FriendlyName : devices[0].FriendlyName;
          if (name) {
            this.state.systemDeviceName = name;
            this.state.osBluetoothConnected = matched ? matched.Status === 'OK' : true;
            const model = findModelByName(name);
            this.state.model = model;
            this.notify();
            return name;
          }
        } else {
          this.state.osBluetoothConnected = false;
          this.notify();
        }
      }
    } catch {
      // Standalone web without local backend
    }
    return null;
  }

  // Turn on Windows Bluetooth service and radio
  public async enableSystemBluetooth(): Promise<void> {
    try {
      await fetch('/api/bluetooth/enable', { method: 'POST' });
    } catch {
      // ignore
    }
  }

  private async openExistingPort(targetPort: any): Promise<boolean> {
    try {
      this.state.isConnecting = true;
      this.notify();

      this.port = targetPort;
      await this.port.open({ baudRate: 9600 });

      this.state.connected = true;
      this.state.isConnecting = false;
      this.notify();

      this.startReading();
      this.initializeDevice();
      return true;
    } catch (err: any) {
      this.state.connected = false;
      this.state.isConnecting = false;
      this.port = null;
      this.notify();
      throw err;
    }
  }

  public async tryAutoConnect(): Promise<boolean> {
    if (!this.isSupported()) return false;
    if (this.state.connected && this.port) return true;

    try {
      const serial = (navigator as any).serial;
      const ports = await serial.getPorts();

      if (ports && ports.length > 0) {
        return await this.openExistingPort(ports[0]);
      }
    } catch {
      // Permission not yet granted or port busy
    }

    return false;
  }

  // DIRECT USER ACTIVATION CONNECT (Must not perform async await before requestPort!)
  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Web Serial API is not supported in this browser. Please use Chrome, Edge, Brave, or Opera.');
    }

    if (this.state.connected && this.port) {
      return true;
    }

    const serial = (navigator as any).serial;

    // Check if port already exists in memory
    try {
      const ports = await serial.getPorts();
      if (ports && ports.length > 0) {
        return await this.openExistingPort(ports[0]);
      }
    } catch {
      // continue to requestPort
    }

    // Direct synchronous user activation requestPort
    this.state.isConnecting = true;
    this.notify();

    try {
      this.port = await serial.requestPort({
        allowedBluetoothServiceClassIds: [SPP_UUID],
        filters: [{ bluetoothServiceClassId: SPP_UUID }],
      });

      return await this.openExistingPort(this.port);
    } catch (err: any) {
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
    // Read serial number first to detect specific earbud model
    await this.sendCommand(COMMANDS.READ_SERIAL);
    await new Promise(r => setTimeout(r, 150));

    await this.sendCommand(COMMANDS.READ_BATTERY);
    await new Promise(r => setTimeout(r, 150));

    await this.sendCommand(COMMANDS.READ_ANC);
    await new Promise(r => setTimeout(r, 150));

    await this.sendCommand(COMMANDS.READ_EQ);
    await new Promise(r => setTimeout(r, 150));

    await this.sendCommand(COMMANDS.READ_GESTURES);
    await new Promise(r => setTimeout(r, 150));

    await this.sendCommand(COMMANDS.READ_FIRMWARE);
    await new Promise(r => setTimeout(r, 150));

    await this.sendCommand(COMMANDS.READ_IN_EAR);
    await new Promise(r => setTimeout(r, 150));

    await this.sendCommand(COMMANDS.READ_LATENCY);
  }

  private async startReading() {
    if (!this.port || !this.port.readable) return;
    this.isReading = true;

    let buffer = new Uint8Array(0);

    try {
      this.reader = this.port.readable.getReader();
      while (this.isReading) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (!value || value.length === 0) continue;

        // Concatenate new bytes into accumulator buffer
        const chunk = new Uint8Array(value.buffer || value);
        const combined = new Uint8Array(buffer.length + chunk.length);
        combined.set(buffer, 0);
        combined.set(chunk, buffer.length);
        buffer = combined;

        // Process all complete packets in buffer
        while (buffer.length >= 8) {
          const syncIdx = buffer.indexOf(0x55);
          if (syncIdx === -1) {
            buffer = new Uint8Array(0);
            break;
          }
          if (syncIdx > 0) {
            buffer = buffer.slice(syncIdx);
            if (buffer.length < 8) break;
          }

          const payloadLen = buffer[5];
          const totalPacketLen = 8 + payloadLen + 2; // header (8) + payload + CRC (2)

          if (buffer.length < totalPacketLen) {
            // Wait for remaining packet chunk
            break;
          }

          const packet = buffer.slice(0, totalPacketLen);
          buffer = buffer.slice(totalPacketLen);
          this.handlePacket(packet);
        }
      }
    } catch (err) {
      // Stream closed or error
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
          let sku = '';
          const head = serial.substring(0, 2);
          if (head === 'SH' || head === '13') {
            sku = serial.substring(4, 6);
          } else if (head === 'MA') {
            const year = serial.substring(6, 8);
            sku = (year === '22' || year === '23') ? '14' : '11200005';
          }
          const detectedModel = findModelBySku(sku, serial);
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
      case RESPONSE_COMMANDS.GESTURE_RESP: {
        if (raw.length > 8) {
          const gestureCount = raw[8];
          const newGestures = { ...this.state.gestures };
          for (let i = 0; i < gestureCount; i++) {
            const base = 9 + i * 4;
            if (base + 3 < raw.length) {
              const dev = raw[base];
              const typ = raw[base + 2];
              const act = raw[base + 3];
              const earKey = dev === 2 ? 'left' : 'right';
              const trigKey = GESTURE_BYTE_TO_TRIGGER[typ] as keyof GestureConfig;
              const actKey = GESTURE_BYTE_TO_ACTION[act] as GestureAction;
              if (earKey && trigKey && actKey) {
                newGestures[earKey] = {
                  ...newGestures[earKey],
                  [trigKey]: actKey,
                };
              }
            }
          }
          this.state.gestures = newGestures;
          this.notify();
        }
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

  // Model selection override
  public setModel(model: EarbudModel) {
    this.state.model = model;
    this.notify();
  }

  // Real Control Methods (Dispatched over Bluetooth Serial)
  public async setAncMode(mode: AncMode) {
    this.state.ancMode = mode;
    this.notify();
    const byte = ancModeToByte(mode);
    await this.sendCommand(COMMANDS.SET_ANC, [0x01, byte, 0x00]);
  }

  public async setPersonalizedAnc(enabled: boolean) {
    this.state.personalizedAnc = enabled;
    this.notify();
    await this.sendCommand(COMMANDS.SET_PERSONAL_ANC, [enabled ? 0x01 : 0x00]);
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

  public async setGesture(ear: 'left' | 'right', trigger: keyof GestureConfig, action: GestureAction) {
    this.state.gestures = {
      ...this.state.gestures,
      [ear]: {
        ...this.state.gestures[ear],
        [trigger]: action,
      },
    };
    this.notify();

    const devByte = ear === 'left' ? 0x02 : 0x03;
    const trigByte = GESTURE_TRIGGER_TO_BYTE[trigger] || 2;
    const actByte = GESTURE_ACTION_TO_BYTE[action] || 2;
    const payload = [0x01, devByte, 0x01, trigByte, actByte];
    await this.sendCommand(COMMANDS.SET_GESTURES, payload);
  }

  public async ringBud(ear: 'left' | 'right', ring: boolean) {
    this.state.ringing[ear] = ring;
    this.notify();
    const budByte = ear === 'left' ? 0x02 : 0x03;
    await this.sendCommand(COMMANDS.SET_RING_BUDS, [budByte, ring ? 0x01 : 0x00]);
  }
}

export const webSerialManager = new WebSerialManager();
