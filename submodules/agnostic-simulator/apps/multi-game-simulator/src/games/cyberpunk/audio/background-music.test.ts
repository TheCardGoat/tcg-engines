import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import {
  BackgroundMusicPlayer,
  DEFAULT_MUSIC,
  MUSIC_STORAGE_KEY,
  readMusicPreferences,
  type MusicBackend,
  type MusicClip,
} from "./background-music";

function backend() {
  const voices: { fadeIn: ReturnType<typeof vi.fn>; fadeOutAndStop: ReturnType<typeof vi.fn> }[] =
    [];
  const audio = {
    now: 0,
    unlock: vi.fn(async () => {}),
    load: vi.fn(async (): Promise<MusicClip> => ({
      duration: 10,
      start: () => {
        const voice = { fadeIn: vi.fn(), fadeOutAndStop: vi.fn() };
        voices.push(voice);
        return voice;
      },
    })),
    setVolume: vi.fn(),
    dispose: vi.fn(),
  } satisfies MusicBackend;
  return { audio, voices };
}
describe("background music playback", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });
  it("starts at 3%, waits for a gesture, plays once and repeats twice, then crossfades and gives the next track two repeats", async () => {
    const { audio, voices } = backend();
    const player = new BackgroundMusicPlayer(audio, DEFAULT_MUSIC, vi.fn());
    expect(audio.setVolume).toHaveBeenLastCalledWith(0.03);
    expect(audio.load).not.toHaveBeenCalled();
    await player.unlock();
    expect(player.snapshot.playingTrackId).toBe("neon-cut-deal");
    audio.now = 10;
    await vi.advanceTimersByTimeAsync(250);
    expect(audio.load).toHaveBeenCalledTimes(1);
    audio.now = 20;
    await vi.advanceTimersByTimeAsync(250);
    expect(audio.load).toHaveBeenCalledTimes(1);
    audio.now = 29.99;
    await vi.advanceTimersByTimeAsync(250);
    expect(audio.load).toHaveBeenCalledTimes(1);
    audio.now = 30;
    await vi.advanceTimersByTimeAsync(250);
    expect(player.snapshot.playingTrackId).toBe("neon-grid-pulse");
    expect(voices[0]?.fadeOutAndStop).toHaveBeenCalledWith(3);
    expect(voices[1]?.fadeIn).toHaveBeenCalledWith(3);
    audio.now = 59.99;
    await vi.advanceTimersByTimeAsync(250);
    expect(audio.load).toHaveBeenCalledTimes(2);
    audio.now = 60;
    await vi.advanceTimersByTimeAsync(250);
    expect(player.snapshot.playingTrackId).toBe("chrome-after-hours");
    player.dispose();
  });
  it("does not count suspended audio time as a completed play", async () => {
    const { audio } = backend();
    const player = new BackgroundMusicPlayer(audio, DEFAULT_MUSIC, vi.fn());
    await player.unlock();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(audio.load).toHaveBeenCalledTimes(1);
    player.dispose();
  });
  it("allows manual changes immediately and keeps mute independent from track selection", async () => {
    const { audio, voices } = backend();
    const player = new BackgroundMusicPlayer(audio, DEFAULT_MUSIC, vi.fn());
    await player.unlock();
    player.setVolume(40);
    player.setMuted(true);
    await player.select("ghost-signal");
    expect(audio.setVolume).toHaveBeenLastCalledWith(0);
    expect(player.snapshot.playingTrackId).toBe("ghost-signal");
    expect(voices[0]?.fadeOutAndStop).toHaveBeenCalledWith(3);
    player.setMuted(false);
    expect(audio.setVolume).toHaveBeenLastCalledWith(0.4);
    await player.select("neon-cut-deal-short");
    player.next();
    await vi.advanceTimersByTimeAsync(0);
    expect(player.snapshot.playingTrackId).toBe("neon-cut-deal");
    player.dispose();
  });
  it("ignores stale loads after rapid selection and after leaving the board", async () => {
    const { audio } = backend();
    const player = new BackgroundMusicPlayer(audio, DEFAULT_MUSIC, vi.fn());
    await player.unlock();
    let resolveSlow: (clip: MusicClip) => void = () => {};
    audio.load.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSlow = resolve;
        }),
    );
    const slow = player.select("ghost-signal");
    await player.select("rain-on-chrome");
    const start = vi.fn();
    resolveSlow({ duration: 10, start });
    await slow;
    expect(start).not.toHaveBeenCalled();
    expect(player.snapshot.playingTrackId).toBe("rain-on-chrome");
    audio.load.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSlow = resolve;
        }),
    );
    const pending = player.select("midnight-circuit");
    player.dispose();
    resolveSlow({ duration: 10, start });
    await pending;
    expect(start).not.toHaveBeenCalled();
    expect(audio.dispose).toHaveBeenCalledOnce();
  });
  it("keeps the current track on load failure and supports retry", async () => {
    const { audio, voices } = backend();
    const player = new BackgroundMusicPlayer(audio, DEFAULT_MUSIC, vi.fn());
    await player.unlock();
    audio.load.mockRejectedValueOnce(new Error("network"));
    await player.select("ghost-signal");
    expect(player.snapshot.status).toBe("error");
    expect(player.snapshot.playingTrackId).toBe("neon-cut-deal");
    expect(voices[0]?.fadeOutAndStop).not.toHaveBeenCalled();
    await player.select("ghost-signal");
    expect(player.snapshot.status).toBe("playing");
    player.dispose();
  });
  it("retries a blocked audio context on the next gesture", async () => {
    const { audio } = backend();
    audio.unlock.mockRejectedValueOnce(new Error("NotAllowedError"));
    const player = new BackgroundMusicPlayer(audio, DEFAULT_MUSIC, vi.fn());
    await player.unlock();
    expect(player.snapshot.status).toBe("waiting");
    expect(audio.load).not.toHaveBeenCalled();
    await player.unlock();
    expect(player.snapshot.status).toBe("playing");
    player.dispose();
  });
  it("restores valid preferences and rejects malformed stored values", () => {
    localStorage.setItem(
      MUSIC_STORAGE_KEY,
      JSON.stringify({ volume: 42, muted: true, trackId: "ghost-signal" }),
    );
    expect(readMusicPreferences()).toEqual({ volume: 42, muted: true, trackId: "ghost-signal" });
    localStorage.setItem(MUSIC_STORAGE_KEY, '{"volume": "loud", "trackId": "missing"}');
    expect(readMusicPreferences()).toEqual(DEFAULT_MUSIC);
  });
});
