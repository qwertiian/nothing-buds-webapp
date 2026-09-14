class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private ringOscillators: { [key: string]: { osc: OscillatorNode; gain: GainNode; interval: number } } = {};

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Tactile Nothing OS click
  public playClick(pitch: number = 800) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch / 3, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }

  // 8-bit Retro GameBoy blip for Pokemon theme
  public playRetroBlip() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.04); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08); // G5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // ignore
    }
  }

  // Find My Earbuds - High intensity radar beacon chirp
  public startRinging(ear: 'left' | 'right') {
    if (this.ringOscillators[ear]) return;

    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);

      if (panner) {
        panner.pan.value = ear === 'left' ? -1 : 1;
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        osc.connect(gain);
        gain.connect(ctx.destination);
      }

      osc.start();

      // Pulsing siren pattern
      let on = false;
      const interval = window.setInterval(() => {
        on = !on;
        const now = ctx.currentTime;
        if (on) {
          osc.frequency.setValueAtTime(ear === 'left' ? 2600 : 3200, now);
          osc.frequency.exponentialRampToValueAtTime(ear === 'left' ? 1400 : 1800, now + 0.2);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
        }
      }, 350);

      this.ringOscillators[ear] = { osc, gain, interval };
    } catch {
      // ignore
    }
  }

  public stopRinging(ear: 'left' | 'right') {
    const ring = this.ringOscillators[ear];
    if (ring) {
      clearInterval(ring.interval);
      try {
        ring.osc.stop();
        ring.osc.disconnect();
      } catch {
        // ignore
      }
      delete this.ringOscillators[ear];
    }
  }

  // Audition EQ with harmonic chord preview
  public playEqPreview(bass: number, mid: number, treble: number) {
    try {
      const ctx = this.getContext();
      const freqs = [120, 240, 480, 1000, 2400, 4800];
      const now = ctx.currentTime;

      // Map bass, mid, treble to gain multipliers
      const bassMult = Math.pow(10, bass / 20);
      const midMult = Math.pow(10, mid / 20);
      const trebleMult = Math.pow(10, treble / 20);

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i < 2 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        let mult = midMult;
        if (i < 2) mult = bassMult;
        else if (i >= 4) mult = trebleMult;

        const baseGain = 0.04 * mult;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(baseGain, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
      });
    } catch {
      // ignore
    }
  }
}

export const soundFx = new SoundSynthesizer();
