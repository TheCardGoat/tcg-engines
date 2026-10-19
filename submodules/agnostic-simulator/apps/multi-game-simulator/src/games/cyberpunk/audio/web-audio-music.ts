import { z } from "zod";
import type { MusicBackend, MusicClip, MusicTrackId } from "./background-music";
export const MUSIC_ASSET_BASE_URL = "https://cdn.tcg.online/public/cyberpunk/audio/background/v1";

const manifestSchema = z.object({
  version: z.literal(1),
  tracks: z.array(
    z.object({
      id: z.string(),
      formats: z.array(
        z.object({
          file: z.string(),
          normalization: z.object({ gain: z.number().finite().positive().max(1) }),
        }),
      ),
    }),
  ),
});
type MusicManifest = z.infer<typeof manifestSchema>;

/** Separate graph from Howler's global sound-effect volume. Created on user input. */
export class WebAudioMusic implements MusicBackend {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private volume = 0.25;
  private disposed = false;
  private manifestPromise: Promise<MusicManifest> | null = null;
  private manifestRequest = new AbortController();
  private loadManifest(): Promise<MusicManifest> {
    this.manifestPromise ??= fetch(`${MUSIC_ASSET_BASE_URL}/manifest.json`, {
      signal: this.manifestRequest.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Music manifest request failed: ${response.status}`);
        return manifestSchema.parse(await response.json());
      })
      .catch((error: unknown) => {
        this.manifestPromise = null;
        throw error;
      });
    return this.manifestPromise;
  }
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
    // Static encoded-file levels are measured at asset publication, never on
    // the gameplay thread. A failed manifest leaves music unavailable; the
    // BackgroundMusicPlayer handles it without blocking or changing the game.
    const manifest = await this.loadManifest();
    signal.throwIfAborted();
    const formats = new Audio().canPlayType('audio/webm; codecs="opus"')
      ? ["webm", "mp3"]
      : ["mp3"];
    let buffer: AudioBuffer | undefined;
    let trim = 0;
    for (const format of formats) {
      const filename = `${track}.${format}`;
      const level = manifest.tracks
        .find((item) => item.id === track)
        ?.formats.find((item) => item.file === filename)?.normalization;
      if (!level) {
        // A corrected CDN manifest must be reachable through Retry music too.
        this.manifestPromise = null;
        throw new Error(`Missing music normalization: ${filename}`);
      }
      try {
        const response = await fetch(`${MUSIC_ASSET_BASE_URL}/${track}.${format}`, { signal });
        if (!response.ok) throw new Error(`Music request failed: ${response.status}`);
        buffer = await context.decodeAudioData(await response.arrayBuffer());
        signal.throwIfAborted();
        trim = level.gain;
        break;
      } catch (error) {
        if (signal.aborted || format === "mp3") throw error;
        // MP3 is the published fallback for browsers unable to decode WebM/Opus.
      }
    }
    if (!buffer || !Number.isFinite(buffer.duration) || buffer.duration <= 0)
      throw new Error("Invalid music duration");
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
    this.manifestRequest.abort();
    if (this.context) void this.context.close().catch(() => undefined);
    this.master = null;
    this.context = null;
  }
}
