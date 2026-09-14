import { AncMode, EqPreset, CustomEqSettings, GestureConfig } from '../../models/types';

export const COMMANDS = {
  READ_SERIAL: 49158,        // 0xC006
  READ_BATTERY: 49159,       // 0xC007
  READ_IN_EAR: 49166,        // 0xC00E
  READ_GESTURES: 49176,      // 0xC018
  READ_ANC: 49182,           // 0xC01E
  READ_EQ: 49183,            // 0xC01F
  READ_LATENCY: 49217,       // 0xC041
  READ_FIRMWARE: 49218,      // 0xC042
  READ_CUSTOM_EQ: 49220,     // 0xC044
  READ_ADVANCED_EQ: 49228,   // 0xC04C
  READ_ENHANCED_BASS: 49230, // 0xC04E

  SET_RING_BUDS: 61442,      // 0xF002
  SET_GESTURES: 61443,       // 0xF003
  SET_IN_EAR: 61444,         // 0xF004
  SET_ANC: 61455,            // 0xF00F
  SET_EQ: 61456,             // 0xF010
  SET_PERSONAL_ANC: 61457,   // 0xF011
  SET_EAR_FIT_TEST: 61460,   // 0xF014
  SET_LATENCY: 61504,        // 0xF040
  SET_CUSTOM_EQ: 61505,      // 0xF041
  SET_ADVANCED_EQ: 61519,    // 0xF04F
  SET_ENHANCED_BASS: 61521,  // 0xF051
};

export const RESPONSE_COMMANDS = {
  SERIAL_RESP: 16390,        // 0x4006
  BATTERY_RESP_1: 16391,     // 0x4007
  BATTERY_RESP_2: 57345,     // 0xE001
  IN_EAR_RESP: 16398,        // 0x400E
  GESTURE_RESP: 16408,       // 0x4018
  ANC_RESP_1: 16414,         // 0x401E
  ANC_RESP_2: 57347,         // 0xE003
  EQ_RESP_1: 16415,          // 0x401F
  EQ_RESP_2: 16464,          // 0x4050
  LATENCY_RESP: 16449,       // 0x4041
  FIRMWARE_RESP: 16450,      // 0x4042
  CUSTOM_EQ_RESP: 16452,     // 0x4044
  ADVANCED_EQ_RESP: 16460,   // 0x404C
  ENHANCED_BASS_RESP: 16462, // 0x404E
};

// Standard Nothing CRC-16 algorithm (poly 0xA001, init 0xFFFF)
export function crc16(buffer: Uint8Array): number {
  let crc = 0xFFFF;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
    }
  }
  return crc;
}

// Build standard Nothing SPP packet
export function buildPacket(command: number, payload: number[] = [], opId: number = 1): Uint8Array {
  const header = [
    0x55,                  // Magic Sync Byte
    0x60,                  // Packet Type
    0x01,                  // Protocol Version
    command & 0xFF,        // Command Low Byte
    (command >> 8) & 0xFF, // Command High Byte
    payload.length,        // Payload Length
    0x00,                  // Reserved
    opId & 0xFF            // Operation Sequence ID
  ];

  const packetWithoutCrc = new Uint8Array([...header, ...payload]);
  const crc = crc16(packetWithoutCrc);
  return new Uint8Array([...packetWithoutCrc, crc & 0xFF, (crc >> 8) & 0xFF]);
}

// Extract command ID from 8-byte header
export function extractCommand(rawData: Uint8Array): number {
  if (rawData.length < 5) return 0;
  return rawData[3] | (rawData[4] << 8);
}

// Battery Parser
export function parseBattery(rawData: Uint8Array) {
  // rawData contains connected count at byte 8, followed by (deviceId, levelAndCharging) pairs
  let left = 100;
  let right = 100;
  let caseBat = 90;
  let leftCharging = false;
  let rightCharging = false;
  let caseCharging = false;

  if (rawData.length >= 9) {
    const connectedDevices = rawData[8];
    for (let i = 0; i < connectedDevices; i++) {
      const offset = 9 + (i * 2);
      if (offset + 1 < rawData.length) {
        const deviceId = rawData[offset];
        const val = rawData[offset + 1];
        const level = val & 0x7F;
        const charging = (val & 0x80) === 0x80;

        if (deviceId === 0x02) { // Left
          left = level;
          leftCharging = charging;
        } else if (deviceId === 0x03) { // Right
          right = level;
          rightCharging = charging;
        } else if (deviceId === 0x04) { // Case
          caseBat = level;
          caseCharging = charging;
        }
      }
    }
  }

  return { left, right, case: caseBat, leftCharging, rightCharging, caseCharging };
}

// ANC Mode Parser
export function parseAnc(rawData: Uint8Array): AncMode {
  if (rawData.length < 10) return 'off';
  // Check standard Nothing payload format [kind=1, value, 0] starting at byte 8
  const payload = rawData.subarray(8);
  for (let offset = 0; offset < payload.length - 1; offset += 3) {
    const kind = payload[offset];
    const val = payload[offset + 1];
    if (kind === 1) {
      return byteToAncMode(val);
    }
  }
  return byteToAncMode(rawData[9]);
}

export function byteToAncMode(val: number): AncMode {
  switch (val) {
    case 1: return 'high';
    case 2: return 'mid';
    case 3: return 'low';
    case 4: return 'adaptive';
    case 5: return 'off';
    case 7: return 'transparency';
    default: return 'off';
  }
}

// ANC Mode to Packet Byte (Official Nothing X / RFCOMM specification)
// 1 = High / Cancellation, 2 = Mid, 3 = Low, 4 = Adaptive, 5 = Off, 7 = Transparency
export function ancModeToByte(mode: AncMode): number {
  switch (mode) {
    case 'high': return 0x01;
    case 'mid': return 0x02;
    case 'low': return 0x03;
    case 'adaptive': return 0x04;
    case 'off': return 0x05;
    case 'transparency': return 0x07;
  }
}

// Gesture protocol mappings
export const GESTURE_TRIGGER_TO_BYTE: Record<string, number> = {
  singleTap: 1,
  doubleTap: 2,
  tripleTap: 3,
  tapAndHold: 7,
  doubleTapAndHold: 9,
};

export const GESTURE_BYTE_TO_TRIGGER: Record<number, string> = {
  1: 'singleTap',
  2: 'doubleTap',
  3: 'tripleTap',
  7: 'tapAndHold',
  9: 'doubleTapAndHold',
};

export const GESTURE_ACTION_TO_BYTE: Record<string, number> = {
  none: 1,
  play_pause: 2,
  previous_track: 8,
  next_track: 9,
  anc_cycle: 10,
  voice_assistant: 11,
  volume_up: 18,
  volume_down: 19,
};

export const GESTURE_BYTE_TO_ACTION: Record<number, string> = {
  1: 'none',
  2: 'play_pause',
  8: 'previous_track',
  9: 'next_track',
  10: 'anc_cycle',
  11: 'voice_assistant',
  18: 'volume_up',
  19: 'volume_down',
  20: 'anc_cycle',
  21: 'anc_cycle',
  22: 'anc_cycle',
};

// Equalizer Preset Parser
export function parseEq(rawData: Uint8Array): EqPreset {
  if (rawData.length <= 8) return 'balanced';
  const mode = rawData[8];
  switch (mode) {
    case 0: return 'balanced';
    case 1: return 'bass';
    case 2: return 'treble';
    case 3: return 'voice';
    case 4: return 'custom';
    case 6: return 'advanced';
    default: return 'balanced';
  }
}

// Equalizer Preset to Packet Byte
export function eqPresetToByte(preset: EqPreset): number {
  switch (preset) {
    case 'balanced': return 0;
    case 'bass': return 1;
    case 'treble': return 2;
    case 'voice': return 3;
    case 'custom': return 4;
    case 'advanced': return 6;
  }
}

// Float32 conversion for Nothing Custom EQ
export function formatFloatForEq(f: number, isTotal: boolean = false): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, f, false); // big endian
  const array = new Uint8Array(buffer);

  if (f !== 0.0 && array[0] === 0 && array[1] === 0 && array[2] === 0) {
    array[3] = (array[3] | 0x80) & 0xFF;
  }

  // Swap endianness
  const swapped = new Uint8Array(4);
  for (let i = 0; i < 4; i++) {
    swapped[i] = array[3 - i];
  }

  if (isTotal && f >= 0) {
    return new Uint8Array([0x00, 0x00, 0x00, 0x80]);
  }

  return swapped;
}

// Build Custom EQ Packet
export function buildCustomEqPayload(eq: CustomEqSettings): number[] {
  const payload = [
    0x03, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x75, 0x44, 0xc3, 0xf5, 0x28, 0x3f, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0xc0, 0x5a, 0x45, 0x00, 0x00, 0x80, 0x3f, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x0c, 0x43, 0xcd, 0xcc, 0x4c, 0x3f, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00
  ];

  const levels = [eq.bass, eq.mid, eq.treble];
  let highest = Math.max(...levels);
  highest = highest / -1;

  const totalBytes = formatFloatForEq(highest, true);
  for (let j = 0; j < 4; j++) {
    payload[1 + j] = totalBytes[j];
  }

  for (let i = 0; i < 3; i++) {
    const bandBytes = formatFloatForEq(levels[i], false);
    for (let j = 0; j < 4; j++) {
      payload[6 + (i * 13) + j] = bandBytes[j];
    }
  }

  return payload;
}

// Firmware String Parser
export function parseFirmware(rawData: Uint8Array): string {
  if (rawData.length < 8) return '1.0.0';
  const size = rawData[5];
  let str = '';
  for (let i = 0; i < size; i++) {
    if (8 + i < rawData.length) {
      str += String.fromCharCode(rawData[8 + i]);
    }
  }
  return str || '1.0.180';
}

// Serial Number Decoder
export function parseSerial(rawData: Uint8Array): string | null {
  try {
    const text = new TextDecoder().decode(rawData.subarray(6));
    // Check CSV line format (standard Nothing firmware response: device,type,value)
    const lines = text.split('\n');
    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length >= 3 && parseInt(parts[1], 10) === 4 && parts[2]) {
        const val = parts[2].trim();
        if (val.length >= 8) return val;
      }
    }
    // Direct regex matching for Nothing & CMF serial prefixes (SH, MA, 13)
    const match = text.match(/(?:SH|MA|13)[A-Za-z0-9]{10,18}/);
    if (match) {
      return match[0];
    }
  } catch {
    // ignore
  }
  return null;
}

