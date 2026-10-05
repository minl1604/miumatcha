/** Original, synthesized cafe sounds. No audio is loaded until a user gesture. */
type Sound = 'click' | 'success' | 'pour' | 'cat' | 'warning';
class CafeAudio {
  private context?: AudioContext;
  private musicGain?: GainNode;
  private effectsGain?: GainNode;
  private timer?: ReturnType<typeof setInterval>;
  private note = 0;
  private paused = false;
  private volumes = { music: 0.18, effects: 0.45 };
  async unlock() {
    if (typeof window === 'undefined') return;
    if (!this.context) {
      this.context = new AudioContext();
      this.musicGain = this.context.createGain(); this.musicGain.connect(this.context.destination);
      this.effectsGain = this.context.createGain(); this.effectsGain.connect(this.context.destination);
      this.configure(this.volumes);
    }
    if (!this.paused) await this.context.resume().catch(() => {});
    if (!this.timer) this.timer = setInterval(() => this.musicNote(), 550);
  }
  configure(value: { music: number; effects: number }) {
    this.volumes = { music: Math.max(0, Math.min(1, value.music)), effects: Math.max(0, Math.min(1, value.effects)) };
    if (this.musicGain) this.musicGain.gain.value = this.volumes.music * 0.18;
    if (this.effectsGain) this.effectsGain.gain.value = this.volumes.effects * 0.28;
  }
  setVolume(music: number, effects: number) { this.configure({ music, effects }); }
  setPaused(value: boolean) {
    this.paused = value;
    if (this.context) {
      if (value) void this.context.suspend();
      else void this.context.resume().catch(() => {});
    }
  }
  private tone(hz: number, duration: number, gain: GainNode, type: OscillatorType = 'sine', delay = 0) {
    if (!this.context || this.paused || this.context.state !== 'running') return;
    const oscillator = this.context.createOscillator(), envelope = this.context.createGain();
    const time = this.context.currentTime + delay;
    oscillator.type = type; oscillator.frequency.value = hz;
    envelope.gain.setValueAtTime(0.001, time); envelope.gain.exponentialRampToValueAtTime(0.28, time + .018);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);
    oscillator.connect(envelope); envelope.connect(gain); oscillator.start(time); oscillator.stop(time + duration + .02);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }
  private musicNote() {
    if (!this.musicGain || this.paused) return;
    const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23, 246.94, 329.63, 392, 493.88, 293.66, 349.23, 392, 329.63];
    this.tone(melody[this.note++ % melody.length], .42, this.musicGain);
    if (this.note % 4 === 0) this.tone(130.81, .7, this.musicGain);
  }
  play(sound: Sound) {
    if (!this.effectsGain || this.paused) return;
    if (sound === 'success') [523.25, 659.25, 783.99].forEach((hz, i) => this.tone(hz, .18, this.effectsGain!, 'sine', i * .08));
    else if (sound === 'cat') [650, 760, 530].forEach((hz, i) => this.tone(hz, .11, this.effectsGain!, 'triangle', i * .06));
    else this.tone(sound === 'click' ? 460 : sound === 'pour' ? 230 : 170, .10, this.effectsGain, 'triangle');
  }
  dispose() {
    if (this.timer) clearInterval(this.timer); this.timer = undefined;
    void this.context?.close(); this.context = undefined; this.musicGain = undefined; this.effectsGain = undefined; this.note = 0;
  }
}
export const audio = new CafeAudio();
export default audio;
