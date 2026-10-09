export const MUSIC_TRACKS = [
  { id: "neon-cut-deal", title: "Neon Cut Deal" },
  { id: "neon-grid-pulse", title: "Neon Grid Pulse" },
  { id: "chrome-after-hours", title: "Chrome After Hours" },
  { id: "midnight-circuit", title: "Midnight Circuit" },
  { id: "ghost-signal", title: "Ghost Signal" },
  { id: "rain-on-chrome", title: "Rain on Chrome" },
  { id: "neon-cut-deal-short", title: "Neon Cut Deal — Short" },
] as const;
export type MusicTrackId = (typeof MUSIC_TRACKS)[number]["id"];
export const MUSIC_STORAGE_KEY = "tcg:cyberpunk:background-music:v1";
export const CROSSFADE_SECONDS = 3;
export const MINIMUM_PLAYS = 3;
export interface MusicPreferences {
  volume: number;
  muted: boolean;
  trackId: MusicTrackId;
}
export interface MusicState extends MusicPreferences {
  status: "waiting" | "loading" | "playing" | "error";
  playingTrackId: MusicTrackId | null;
}
export const DEFAULT_MUSIC: MusicPreferences = {
  volume: 3,
  muted: false,
  trackId: "neon-cut-deal",
};
export function isMusicTrackId(value: unknown): value is MusicTrackId {
  return MUSIC_TRACKS.some((track) => track.id === value);
}
export function readMusicPreferences(): MusicPreferences {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(MUSIC_STORAGE_KEY) ?? "null");
    if (typeof value !== "object" || value === null) return DEFAULT_MUSIC;
    return {
      volume:
        "volume" in value && typeof value.volume === "number" && Number.isFinite(value.volume)
          ? Math.max(0, Math.min(100, value.volume))
          : DEFAULT_MUSIC.volume,
      muted: "muted" in value && value.muted === true,
      trackId:
        "trackId" in value && isMusicTrackId(value.trackId) ? value.trackId : DEFAULT_MUSIC.trackId,
    };
  } catch {
    return DEFAULT_MUSIC;
  }
}
export interface MusicVoice {
  fadeIn(seconds: number): void;
  fadeOutAndStop(seconds: number): void;
}
export interface MusicClip {
  duration: number;
  start(): MusicVoice;
}
export interface MusicBackend {
  readonly now: number;
  unlock(): Promise<void>;
  load(track: MusicTrackId, signal: AbortSignal): Promise<MusicClip>;
  setVolume(gain: number): void;
  dispose(): void;
}

/** Uses the audio clock, not wall time: suspended audio cannot count as a play. */
export class BackgroundMusicPlayer {
  private state: MusicState;
  private voice: MusicVoice | null = null;
  private rotatesAt = Infinity;
  private request: AbortController | null = null;
  private unlocked = false;
  private unlocking: Promise<void> | null = null;
  private disposed = false;
  private timer: ReturnType<typeof setInterval>;

  constructor(
    private backend: MusicBackend,
    preferences: MusicPreferences,
    private changed: (state: MusicState) => void,
  ) {
    this.state = { ...preferences, status: "waiting", playingTrackId: null };
    this.applyVolume();
    this.timer = setInterval(() => {
      if (this.state.status === "playing" && this.backend.now >= this.rotatesAt) this.next();
    }, 250);
  }
  get snapshot(): MusicState {
    return this.state;
  }
  private update(patch: Partial<MusicState>) {
    this.state = { ...this.state, ...patch };
    this.changed(this.state);
  }
  private applyVolume() {
    this.backend.setVolume(this.state.muted ? 0 : this.state.volume / 100);
  }
  setVolume(volume: number) {
    if (!Number.isFinite(volume)) return;
    this.update({ volume: Math.max(0, Math.min(100, volume)) });
    this.applyVolume();
  }
  setMuted(muted: boolean) {
    this.update({ muted });
    this.applyVolume();
  }
  async unlock() {
    if (this.disposed || this.unlocking) return;
    this.unlocking = this.backend.unlock();
    try {
      await this.unlocking;
      if (this.disposed) return;
      if (!this.unlocked) {
        this.unlocked = true;
        await this.select(this.state.trackId);
      }
    } catch {
      if (!this.disposed && !this.unlocked) this.update({ status: "waiting" });
    } finally {
      this.unlocking = null;
    }
  }
  next() {
    const index = MUSIC_TRACKS.findIndex((track) => track.id === this.state.trackId);
    const next = MUSIC_TRACKS[(index + 1) % MUSIC_TRACKS.length];
    if (next) void this.select(next.id);
  }
  async select(trackId: MusicTrackId) {
    if (this.disposed) return;
    this.request?.abort();
    this.rotatesAt = Infinity;
    this.update({ trackId, status: this.unlocked ? "loading" : "waiting" });
    if (!this.unlocked) return;
    const request = new AbortController();
    this.request = request;
    try {
      const clip = await this.backend.load(trackId, request.signal);
      if (request.signal.aborted || this.disposed) return;
      const outgoing = this.voice;
      this.voice = clip.start();
      this.voice.fadeIn(CROSSFADE_SECONDS);
      outgoing?.fadeOutAndStop(CROSSFADE_SECONDS);
      // Keep looping during fetch/decode. Crossfade only after the initial play and two complete repeats.
      this.rotatesAt = this.backend.now + clip.duration * MINIMUM_PLAYS;
      this.update({ status: "playing", playingTrackId: trackId });
    } catch {
      if (!request.signal.aborted && !this.disposed) this.update({ status: "error" });
    }
  }
  dispose() {
    this.disposed = true;
    clearInterval(this.timer);
    this.request?.abort();
    this.backend.dispose();
  }
}
