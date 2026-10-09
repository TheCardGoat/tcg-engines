// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

const howlerMock = vi.hoisted(() => {
  const instances: Array<{
    options: { onload?: () => void; src?: string[] };
    state: () => string;
    once: ReturnType<typeof vi.fn>;
    play: ReturnType<typeof vi.fn>;
    unload: ReturnType<typeof vi.fn>;
  }> = [];
  return { instances, volume: vi.fn(), ctx: { state: "running", resume: vi.fn(async () => {}) } };
});

vi.mock("howler", () => ({
  Howl: class {
    readonly play = vi.fn();
    readonly unload = vi.fn();
    readonly state = () => "loaded";
    readonly once = vi.fn();

    constructor(readonly options: { onload?: () => void; src?: string[] }) {
      howlerMock.instances.push(this);
    }
  },
  Howler: { volume: howlerMock.volume, ctx: howlerMock.ctx },
}));

import {
  disposeSimulatorSoundService,
  initSimulatorSoundService,
  playSimulatorSound,
  setSimulatorSoundPack,
  preloadSimulatorSoundAsset,
  setSimulatorSoundVolume,
} from "@tcg/simulator-presentation/audio/sound-service";

const realUserAgent = window.navigator.userAgent;

describe("simulator sound service", () => {
  afterEach(() => {
    disposeSimulatorSoundService();
    howlerMock.instances.length = 0;
    howlerMock.ctx.state = "running";
    setSimulatorSoundVolume(50);
    vi.clearAllMocks();
    Object.defineProperty(window.navigator, "userAgent", {
      value: realUserAgent,
      configurable: true,
    });
  });

  it("resumes idle audio synchronously on a new play gesture, including after initialization", async () => {
    await initSimulatorSoundService();
    expect(howlerMock.ctx.resume).not.toHaveBeenCalled();
    howlerMock.ctx.state = "suspended";
    const ready = initSimulatorSoundService();
    expect(howlerMock.ctx.resume).toHaveBeenCalledTimes(1);
    await ready;
  });

  it("plays a cue requested while the selected sound pack is still loading", async () => {
    // Howler is mocked, so nothing fetches: bypass the jsdom CDN-load guard.
    Object.defineProperty(window.navigator, "userAgent", {
      value: "test-browser",
      configurable: true,
    });
    const ready = setSimulatorSoundPack("tabletop");
    const cardPlay = howlerMock.instances[2];
    expect(cardPlay).toBeDefined();

    playSimulatorSound("card.play");
    expect(cardPlay!.play).not.toHaveBeenCalled();

    for (const instance of howlerMock.instances) instance.options.onload?.();
    await ready;
    await Promise.resolve();

    expect(cardPlay!.play).toHaveBeenCalledTimes(1);
  });
  it("cancels a queued cue when its scene is muted before loading completes", async () => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: "test-browser",
      configurable: true,
    });
    const ready = setSimulatorSoundPack("tabletop");
    const cardPlay = howlerMock.instances[2];
    let audible = true;
    playSimulatorSound("card.play", () => audible);
    audible = false;
    for (const instance of howlerMock.instances) instance.options.onload?.();
    await ready;
    await Promise.resolve();
    expect(cardPlay!.play).not.toHaveBeenCalled();
  });
  it("preloads one game asset and uses it instead of the synthesized cue", () => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: "test-browser",
      configurable: true,
    });
    const url = "/assets/card-place-2.ogg";
    preloadSimulatorSoundAsset(url);
    preloadSimulatorSoundAsset(url);
    expect(howlerMock.instances).toHaveLength(1);
    playSimulatorSound("resource.gain", () => true, url);
    expect(howlerMock.instances[0]?.options.src).toEqual([url]);
    expect(howlerMock.instances[0]?.play).toHaveBeenCalledTimes(1);
    setSimulatorSoundVolume(0);
    playSimulatorSound("resource.gain", () => true, url);
    expect(howlerMock.instances[0]?.play).toHaveBeenCalledTimes(1);
    disposeSimulatorSoundService();
    expect(howlerMock.instances[0]?.unload).toHaveBeenCalledTimes(1);
  });
});
