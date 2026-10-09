import { afterEach, expect, it, vi } from "vite-plus/test";
import { WebAudioMusic } from "./web-audio-music";

function setup() {
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
      getChannelData: () => new Float32Array([0.05, -0.05]),
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
  const fetch = vi.fn(
    async (_url: RequestInfo | URL, _init?: RequestInit) => new Response(new ArrayBuffer(8)),
  );
  vi.stubGlobal("fetch", fetch);
  return { context, gains, sources, fetch };
}
afterEach(() => vi.unstubAllGlobals());
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
  const { context, fetch } = setup();
  context.decodeAudioData.mockRejectedValueOnce(new Error("unsupported"));
  const backend = new WebAudioMusic();
  await backend.unlock();
  const clip = await backend.load("ghost-signal", new AbortController().signal);
  expect(clip.duration).toBe(32);
  expect(fetch.mock.calls.map((call) => call[0])).toEqual([
    "https://cdn.tcg.online/public/cyberpunk/audio/background/v1/ghost-signal.webm",
    "https://cdn.tcg.online/public/cyberpunk/audio/background/v1/ghost-signal.mp3",
  ]);
  backend.dispose();
});

it("attenuates loud tracks and keeps the trim during crossfade", async () => {
  const { context, gains } = setup();
  context.decodeAudioData.mockResolvedValueOnce({
    duration: 32,
    numberOfChannels: 1,
    length: 2,
    getChannelData: () => new Float32Array([0.5, -0.5]),
  });
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
