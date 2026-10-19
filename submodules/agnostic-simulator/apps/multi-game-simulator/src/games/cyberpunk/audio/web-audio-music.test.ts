import { afterEach, expect, it, vi } from "vite-plus/test";
import { WebAudioMusic, MUSIC_ASSET_BASE_URL } from "./web-audio-music";

function setup() {
  const manifest = {
    version: 1,
    tracks: ["neon-cut-deal", "ghost-signal", "neon-grid-pulse"].map((id) => ({
      id,
      formats: ["webm", "mp3"].map((format) => ({
        file: `${id}.${format}`,
        normalization: { gain: id === "neon-grid-pulse" ? 0.2 : format === "mp3" ? 0.4 : 1 },
      })),
    })),
  };
  const gains: FakeGain[] = [];
  const sources: FakeSource[] = [];
  class FakeGain {
    gain = {
      value: 1,
      setTargetAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
      setValueAtTime: vi.fn(),
    };
    connect = vi.fn();
    disconnect = vi.fn();
  }
  class FakeSource {
    buffer: unknown;
    loop = false;
    onended: (() => void) | null = null;
    connect = vi.fn();
    disconnect = vi.fn();
    start = vi.fn();
    stop = vi.fn();
  }
  const context = {
    currentTime: 10,
    destination: {},
    resume: vi.fn(async () => {}),
    close: vi.fn(async () => {}),
    createGain: () => {
      const gain = new FakeGain();
      gains.push(gain);
      return gain;
    },
    createBiquadFilter: () => ({
      type: "",
      frequency: { value: 0 },
      gain: { value: 0 },
      connect: vi.fn(),
    }),
    createBufferSource: () => {
      const source = new FakeSource();
      sources.push(source);
      return source;
    },
    decodeAudioData: vi.fn(async () => ({
      duration: 32,
      numberOfChannels: 1,
      length: 2,
      getChannelData: vi.fn(() => {
        throw new Error("Playback must not scan PCM samples");
      }),
    })),
  };
  vi.stubGlobal(
    "AudioContext",
    class {
      constructor() {
        return context;
      }
    },
  );
  vi.stubGlobal(
    "Audio",
    class {
      canPlayType() {
        return "probably";
      }
    },
  );
  const fetch = vi.fn(async (url: RequestInfo | URL, _init?: RequestInit) =>
    String(url).endsWith("/manifest.json")
      ? Response.json(manifest)
      : new Response(new ArrayBuffer(8)),
  );
  vi.stubGlobal("fetch", fetch);
  return { context, gains, sources, fetch };
}
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
it("loops decoded audio and schedules continuous crossfade ramps independent of master volume", async () => {
  const { context, gains, sources } = setup();
  const backend = new WebAudioMusic();
  backend.setVolume(0.25);
  await backend.unlock();
  expect(gains[0]?.gain.value).toBe(0.25);
  const clip = await backend.load("neon-cut-deal", new AbortController().signal);
  const voice = clip.start();
  voice.fadeIn(3);
  expect(sources[0]?.loop).toBe(true);
  expect(gains[1]?.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(1, 13);
  context.currentTime = 11;
  voice.fadeOutAndStop(3);
  expect(gains[1]?.gain.setValueAtTime).toHaveBeenCalledWith(1 / 3, 11);
  expect(gains[1]?.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(0, 14);
  expect(sources[0]?.stop).toHaveBeenCalledWith(14);
  backend.setVolume(0);
  expect(gains[0]?.gain.setTargetAtTime).toHaveBeenLastCalledWith(0, 11, 0.03);
  sources[0]?.onended?.();
  expect(sources[0]?.disconnect).toHaveBeenCalledOnce();
  expect(gains[1]?.disconnect).toHaveBeenCalledOnce();
  backend.dispose();
  expect(context.close).toHaveBeenCalledOnce();
});
it("falls back to the published MP3 when Opus decoding fails", async () => {
  const { context, fetch, gains } = setup();
  context.decodeAudioData.mockRejectedValueOnce(new Error("unsupported"));
  const backend = new WebAudioMusic();
  await backend.unlock();
  const clip = await backend.load("ghost-signal", new AbortController().signal);
  expect(clip.duration).toBe(32);
  clip.start().fadeIn(3);
  expect(gains[1]?.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(0.4, 13);
  expect(fetch.mock.calls.map((call) => call[0])).toEqual([
    `${MUSIC_ASSET_BASE_URL}/manifest.json`,
    "https://cdn.tcg.online/public/cyberpunk/audio/background/v1/ghost-signal.webm",
    "https://cdn.tcg.online/public/cyberpunk/audio/background/v1/ghost-signal.mp3",
  ]);
  backend.dispose();
});

it("uses published gain without reading samples and keeps it during crossfade", async () => {
  const { context, gains } = setup();
  const backend = new WebAudioMusic();
  await backend.unlock();
  const voice = (await backend.load("neon-grid-pulse", new AbortController().signal)).start();
  voice.fadeIn(3);
  expect(gains[1]?.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(0.2, 13);
  context.currentTime = 13;
  voice.fadeOutAndStop(3);
  expect(gains[1]?.gain.setValueAtTime).toHaveBeenCalledWith(0.2, 13);
  backend.dispose();
});

it("fetches the manifest once across track changes", async () => {
  const { fetch } = setup();
  const backend = new WebAudioMusic();
  await backend.unlock();
  await backend.load("neon-cut-deal", new AbortController().signal);
  await backend.load("ghost-signal", new AbortController().signal);
  expect(fetch.mock.calls.filter(([url]) => String(url).endsWith("/manifest.json"))).toHaveLength(
    1,
  );
  backend.dispose();
});
it("rejects invalid or unavailable metadata without scanning and permits a later retry", async () => {
  const { fetch, context } = setup();
  fetch.mockResolvedValueOnce(
    Response.json({
      version: 1,
      tracks: [
        {
          id: "neon-cut-deal",
          formats: [{ file: "neon-cut-deal.webm", normalization: { gain: 5 } }],
        },
      ],
    }),
  );
  const backend = new WebAudioMusic();
  await backend.unlock();
  await expect(backend.load("neon-cut-deal", new AbortController().signal)).rejects.toThrow();
  expect(context.decodeAudioData).not.toHaveBeenCalled();
  fetch.mockResolvedValueOnce(new Response(null, { status: 503 }));
  await expect(backend.load("neon-cut-deal", new AbortController().signal)).rejects.toThrow(
    "Music manifest request failed",
  );
  await expect(backend.load("neon-cut-deal", new AbortController().signal)).resolves.toMatchObject({
    duration: 32,
  });
  backend.dispose();
});

it.each([
  { version: 1, tracks: [] },
  { version: 1, tracks: [{ id: "neon-cut-deal", formats: [] }] },
])("refetches corrected metadata after a missing track or format", async (manifest) => {
  const { fetch, context } = setup();
  fetch.mockResolvedValueOnce(Response.json(manifest));
  const backend = new WebAudioMusic();
  await backend.unlock();
  await expect(backend.load("neon-cut-deal", new AbortController().signal)).rejects.toThrow(
    "Missing music normalization",
  );
  expect(context.decodeAudioData).not.toHaveBeenCalled();
  await expect(backend.load("neon-cut-deal", new AbortController().signal)).resolves.toMatchObject({
    duration: 32,
  });
  expect(fetch.mock.calls.filter(([url]) => String(url).endsWith("/manifest.json"))).toHaveLength(
    2,
  );
  backend.dispose();
});
