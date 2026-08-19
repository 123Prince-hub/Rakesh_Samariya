/**
 * Pure Web Audio API Ambient Sound Synthesizer
 * Generates realistic monsoon rain drizzle, subtle retro radio static, and atmospheric warmth.
 * Requires no external audio files, works instantly in any browser.
 */

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private rainGain: GainNode | null = null;
  private radioStaticGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isRunning = false;
  private rainNoiseNode: AudioNode | null = null;
  private staticNoiseNode: AudioNode | null = null;

  constructor() {}

  private initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Rain Gain
    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.rainGain.connect(this.masterGain);

    // Radio Static Gain (subtle vintage warmth)
    this.radioStaticGain = this.ctx.createGain();
    this.radioStaticGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    this.radioStaticGain.connect(this.masterGain);
  }

  public start() {
    this.initContext();
    if (!this.ctx || !this.masterGain || !this.rainGain || !this.radioStaticGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isRunning) return;
    this.isRunning = true;

    // 1. Create Rain Generator (Pink noise with bandpass filtering)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // scale down
      b6 = white * 0.115926;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    // Filter rain to sound like soft drops falling on the tin shop awning and wet pavement
    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    rainFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const rainHighpass = this.ctx.createBiquadFilter();
    rainHighpass.type = 'highpass';
    rainHighpass.frequency.setValueAtTime(250, this.ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainHighpass);
    rainHighpass.connect(this.rainGain);
    rainSource.start(0);
    this.rainNoiseNode = rainSource;

    // 2. Create subtle Vintage Radio AM Transistor Crackle
    const staticBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const staticData = staticBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // sparse pops + gentle brownian hum
      const pop = Math.random() > 0.998 ? (Math.random() * 2 - 1) * 0.8 : 0;
      staticData[i] = (Math.random() * 2 - 1) * 0.08 + pop;
    }

    const staticSource = this.ctx.createBufferSource();
    staticSource.buffer = staticBuffer;
    staticSource.loop = true;

    const staticFilter = this.ctx.createBiquadFilter();
    staticFilter.type = 'bandpass';
    staticFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    staticFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    staticSource.connect(staticFilter);
    staticFilter.connect(this.radioStaticGain);
    staticSource.start(0);
    this.staticNoiseNode = staticSource;
  }

  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    try {
      if (this.rainNoiseNode) {
        (this.rainNoiseNode as AudioScheduledSourceNode).stop();
        this.rainNoiseNode.disconnect();
      }
      if (this.staticNoiseNode) {
        (this.staticNoiseNode as AudioScheduledSourceNode).stop();
        this.staticNoiseNode.disconnect();
      }
    } catch {
      // ignore
    }
  }

  public setRainVolume(volume: number) {
    // volume: 0 to 1
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume * 0.6)), this.ctx.currentTime, 0.1);
    }
  }

  public setStaticVolume(volume: number) {
    if (this.radioStaticGain && this.ctx) {
      this.radioStaticGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume * 0.1)), this.ctx.currentTime, 0.1);
    }
  }

  public setMasterVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.1);
    }
  }

  public triggerTuningSwoosh() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }

  public isEnabled(): boolean {
    return this.isRunning;
  }
}

export const ambientEngine = new AmbientAudioEngine();
