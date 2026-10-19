// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { loadMainPhaseDemo } from "../fixtures/main-phase-demo.ts";
import { DEV_PLAYER_ONE } from "../dev-runtime.ts";
import { simulatorExternalCommandGateFor } from "@tcg/simulator-runtime/animation";
import type { DecisionRequest } from "../../../../../simulator/bot/decision-worker";
import type { GundamBotInput, GundamBotContext } from "./bot-decision";
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

class WorkerStub {
  static instances: WorkerStub[] = [];
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  onmessageerror: (() => void) | null = null;
  postMessage = vi.fn<(request: DecisionRequest<GundamBotInput, GundamBotContext>) => void>();
  terminate = vi.fn();
  constructor() {
    WorkerStub.instances.push(this);
  }
  reply(output: unknown) {
    const request = this.postMessage.mock.calls.at(-1)![0];
    this.onmessage?.(new MessageEvent("message", { data: { id: request.id, output } }));
  }
}

describe("strategy bot background planning", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    WorkerStub.instances = [];
  });
  it("starts work during pacing and validates pre-ranked moves only after the delay", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("Worker", WorkerStub);
    const dev = loadMainPhaseDemo();
    const onAction = vi.fn();
    const onDecision = vi.fn();
    const initial = dev.runtime.getState().ctx._stateID;
    const bot = attachStrategyBot(dev.runtime, dev.staticResources, DEV_PLAYER_ONE, {
      onAction,
      onDecision,
    });
    const worker = WorkerStub.instances[0]!;
    expect(worker.postMessage).toHaveBeenCalledOnce();
    expect(structuredClone(worker.postMessage.mock.calls[0]![0])).toEqual(
      worker.postMessage.mock.calls[0]![0],
    );
    worker.reply([{ family: "passTurn" }]);
    await vi.advanceTimersByTimeAsync(BOT_SPEED_MS.balanced - 1);
    expect(dev.runtime.getState().ctx._stateID).toBe(initial);
    await vi.advanceTimersByTimeAsync(1);
    expect(dev.runtime.getState().ctx._stateID).toBeGreaterThan(initial);
    expect(onAction).toHaveBeenCalledOnce();
    expect(onDecision).toHaveBeenCalledOnce();
    bot.dispose();
  });

  it.each(["pause", "state replacement", "strategy", "dispose"])(
    "cancels work after %s and ignores late replies",
    async (change) => {
      vi.useFakeTimers();
      vi.stubGlobal("Worker", WorkerStub);
      const dev = loadMainPhaseDemo();
      const onAction = vi.fn();
      const bot = attachStrategyBot(dev.runtime, dev.staticResources, DEV_PLAYER_ONE, { onAction });
      const worker = WorkerStub.instances[0]!;
      if (change === "pause") bot.setMode("paused");
      if (change === "state replacement")
        dev.runtime.loadState(structuredClone(dev.runtime.getState()));
      if (change === "strategy") bot.setStrategy({ name: "custom", selectCandidates: () => [] });
      if (change === "dispose") bot.dispose();
      bot.setMode("paused");
      worker.reply([{ family: "passTurn" }]);
      await vi.advanceTimersByTimeAsync(2000);
      expect(onAction).not.toHaveBeenCalled();
      expect(worker.terminate).toHaveBeenCalledOnce();
      bot.dispose();
    },
  );

  it("pauses with a recoverable error when the worker fails", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("Worker", WorkerStub);
    const dev = loadMainPhaseDemo();
    const bot = attachStrategyBot(dev.runtime, dev.staticResources, DEV_PLAYER_ONE);
    WorkerStub.instances[0]!.onerror?.();
    await vi.advanceTimersByTimeAsync(0);
    expect(bot.getMode()).toBe("paused");
    expect(bot.getError()).toMatch(/worker failed/);
    bot.setMode("step");
    expect(bot.getError()).toBeNull();
    bot.dispose();
  });
});
