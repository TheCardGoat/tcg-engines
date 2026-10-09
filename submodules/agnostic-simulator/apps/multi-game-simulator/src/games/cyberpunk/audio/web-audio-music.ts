import type { MusicBackend, MusicClip, MusicTrackId } from "./background-music";
const BASE_URL = "https://cdn.tcg.online/public/cyberpunk/audio/background/v1";

/** Separate graph from Howler's global sound-effect volume. Created on user input. */
export class WebAudioMusic implements MusicBackend {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private volume = 0.25;
  private disposed = false;
  get now() {
    return this.context?.currentTime ?? 0;
  }
  async unlock() {
    if (this.disposed) return;
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume;
      const warmth = this.context.createBiquadFilter();
      warmth.type = "highshelf";
      warmth.frequency.value = 2400;
      warmth.gain.value = -6;
      this.master.connect(warmth);
      warmth.connect(this.context.destination);
    }
    await this.context.resume();
  }
  setVolume(gain: number) {
    this.volume = gain;
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(gain, this.context.currentTime, 0.03);
    }
  }
  async load(track: MusicTrackId, signal: AbortSignal): Promise<MusicClip> {
    const context = this.context;
    const master = this.master;
    if (!context || !master || this.disposed) throw new Error("Music is not unlocked");
    const formats = new Audio().canPlayType('audio/webm; codecs="opus"')
      ? ["webm", "mp3"]
      : ["mp3"];
    let buffer: AudioBuffer | undefined;
    for (const format of formats) {
      try {
        const response = await fetch(`${BASE_URL}/${track}.${format}`, { signal });
        if (!response.ok) throw new Error(`Music request failed: ${response.status}`);
        buffer = await context.decodeAudioData(await response.arrayBuffer());
        break;
      } catch (error) {
        if (signal.aborted || format === "mp3") throw error;
        // MP3 is the published fallback for browsers unable to decode WebM/Opus.
      }
    }
    if (!buffer || !Number.isFinite(buffer.duration) || buffer.duration <= 0)
      throw new Error("Invalid music duration");
    // Match track levels without changing the source assets. Leave headroom
    // for overlapping tracks during the crossfade.
    let sumSquares = 0;
    let peak = 0;
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      for (const sample of buffer.getChannelData(channel)) {
        sumSquares += sample * sample;
        peak = Math.max(peak, Math.abs(sample));
      }
    }
    const rms = Math.sqrt(sumSquares / (buffer.length * buffer.numberOfChannels));
    const trim = rms > 0 && peak > 0 ? Math.min(1, 0.1 / rms, 0.5 / peak) : 1;
    const decoded = buffer;
    return {
      duration: decoded.duration,
      start: () => {
        const source = context.createBufferSource();
        const envelope = context.createGain();
        source.buffer = decoded;
        source.loop = true;
        source.connect(envelope);
        envelope.connect(master);
        envelope.gain.value = 0;
        const started = context.currentTime;
        let fadeDuration = 0;
        source.onended = () => {
          source.disconnect();
          envelope.disconnect();
        };
        source.start();
        return {
          fadeIn: (seconds) => {
            fadeDuration = seconds;
            envelope.gain.linearRampToValueAtTime(trim, context.currentTime + seconds);
          },
          fadeOutAndStop: (seconds) => {
            const now = context.currentTime;
            const current =
              trim * (fadeDuration > 0 ? Math.min(1, (now - started) / fadeDuration) : 1);
            envelope.gain.cancelScheduledValues(now);
            envelope.gain.setValueAtTime(current, now);
            envelope.gain.linearRampToValueAtTime(0, now + seconds);
            source.stop(now + seconds);
          },
        };
      },
    };
  }
  dispose() {
    this.disposed = true;
    if (this.context) void this.context.close().catch(() => undefined);
    this.master = null;
    this.context = null;
  }
}
