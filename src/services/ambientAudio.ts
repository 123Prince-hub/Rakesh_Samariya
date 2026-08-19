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

    // Rain generator functionality removed as requested
    this.rainNoiseNode = null;

    // FM Radio Static Crackle functionality removed as requested
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
    // FM tuning functionality removed as requested
  }

  public isEnabled(): boolean {
    return this.isRunning;
  }
}

export const ambientEngine = new AmbientAudioEngine();
