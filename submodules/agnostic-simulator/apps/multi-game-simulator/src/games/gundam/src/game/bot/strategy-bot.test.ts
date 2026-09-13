// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { loadMainPhaseDemo } from "../fixtures/main-phase-demo.ts";
import { DEV_PLAYER_ONE } from "../dev-runtime.ts";
import { simulatorExternalCommandGateFor } from "@tcg/simulator-runtime/animation";
import { attachStrategyBot, BOT_SPEED_MS, type BotSpeed } from "./strategy-bot.ts";

afterEach(() => {
  vi.useRealTimers();
});

describe("strategy bot animation pacing", () => {
  it("uses Lorcana vs-AI delay buckets", () => {
    expect(BOT_SPEED_MS).toEqual({
      fast: 250,
      balanced: 800,
      slow: 1400,
    });
  });

  it.each([
    ["balanced", BOT_SPEED_MS.balanced],
    ["slow", BOT_SPEED_MS.slow],
  ] as const)("waits for playback completion in %s mode", async (speed, delayMs) => {
    vi.useFakeTimers();
    const dev = loadMainPhaseDemo();
    const gate = simulatorExternalCommandGateFor(dev.runtime);
    gate.setBlocked(true);
    const initialStateId = dev.runtime.getState().ctx._stateID;
    const bot = attachStrategyBot(dev.runtime, dev.staticResources, DEV_PLAYER_ONE, { speed });

    await vi.advanceTimersByTimeAsync(delayMs * 2);
    expect(dev.runtime.getState().ctx._stateID).toBe(initialStateId);

    gate.setBlocked(false);
    await vi.advanceTimersByTimeAsync(delayMs - 1);
    expect(dev.runtime.getState().ctx._stateID).toBe(initialStateId);
    await vi.advanceTimersByTimeAsync(1);
    expect(dev.runtime.getState().ctx._stateID).toBeGreaterThan(initialStateId);

    bot.dispose();
  });

  it("blocks fast mode while presentation state is transitioning", async () => {
    vi.useFakeTimers();
    const dev = loadMainPhaseDemo();
    const gate = simulatorExternalCommandGateFor(dev.runtime);
    gate.setBlocked(true);
    const initialStateId = dev.runtime.getState().ctx._stateID;
    const bot = attachStrategyBot(dev.runtime, dev.staticResources, DEV_PLAYER_ONE, {
      speed: "fast" satisfies BotSpeed,
    });

    await vi.advanceTimersByTimeAsync(BOT_SPEED_MS.fast);
    expect(dev.runtime.getState().ctx._stateID).toBe(initialStateId);

    bot.dispose();
  });
});
