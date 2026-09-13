// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

const howlerMock = vi.hoisted(() => {
  const instances: Array<{
    options: { onload?: () => void };
    play: ReturnType<typeof vi.fn>;
    unload: ReturnType<typeof vi.fn>;
  }> = [];
  return { instances, volume: vi.fn() };
});

vi.mock("howler", () => ({
  Howl: class {
    readonly play = vi.fn();
    readonly unload = vi.fn();

    constructor(readonly options: { onload?: () => void }) {
      howlerMock.instances.push(this);
    }
  },
  Howler: { volume: howlerMock.volume },
}));

import {
  disposeSimulatorSoundService,
  playSimulatorSound,
  setSimulatorSoundPack,
} from "./sound-service.ts";

describe("simulator sound service", () => {
  afterEach(() => {
    disposeSimulatorSoundService();
    howlerMock.instances.length = 0;
    vi.clearAllMocks();
  });

  it("plays a cue requested while the selected sound pack is still loading", async () => {
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
});
