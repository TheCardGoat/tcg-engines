import { describe, expect, it, vi } from "vite-plus/test";
import { FabMatchRuntime } from "../runtime.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import {
  bravo,
  cosmicFlareRed,
  dash,
  nimbleStrikeRed,
  nimblismBlue,
  snatchRed,
  threadbareTunic,
} from "../rules/fixtures.ts";
import { getFabAutoPassPriorityCommand } from "./auto-pass.ts";
import { listLegalCommands } from "../rules/legal-commands/index.ts";
import { FAB_DEFAULT_AUTOMATION_PREFERENCES } from "../state.ts";

// Preserve real behavior while wrapping the enumeration entry point in a spy,
// so the own-skip perf guard can prove the skip decision never pays for the
// full legal-command proof (probe validation, rules-view build).
vi.mock("../rules/legal-commands/index.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../rules/legal-commands/index.ts")>();
  return { ...actual, listLegalCommands: vi.fn(actual.listLegalCommands) };
});

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("getFabAutoPassPriorityCommand", () => {
  it("returns null in the empty-stack Action Phase", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 4 }, { hero: dash, deck: 4 }, manual);

    expect(getFabAutoPassPriorityCommand(game.getRuntime())).toBeNull();
  });

  it("returns pass for a response-free stack window", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    game.as(bravo).play(snatchRed);

    expect(getFabAutoPassPriorityCommand(game.getRuntime())).toMatchObject({ move: "pass" });
  });

  it("stops when the priority player can play an instant", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    game.as(bravo).play(snatchRed);

    expect(getFabAutoPassPriorityCommand(game.getRuntime())).toBeNull();
  });

  it("stops when the priority player can activate an ability", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], chest: [threadbareTunic], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    game.as(bravo).play(snatchRed);

    expect(getFabAutoPassPriorityCommand(game.getRuntime())).toBeNull();
  });

  it("stops for an engine decision", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, nimblismBlue], deck: 4, resourcePoints: 0 },
      { hero: dash, deck: 4 },
      manual,
    );
    const instanceId = game.findCardInZone(game.as(bravo).id, "hand", nimbleStrikeRed);
    game.as(bravo).exec({ move: "begin-play", payload: { instanceId } });

    expect(game.getState().decision).not.toBeNull();
    expect(getFabAutoPassPriorityCommand(game.getRuntime())).toBeNull();
  });

  it("never converts a no-blockers declaration into an automatic pass", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    game.as(bravo).attackWith(snatchRed);

    expect(game.combat()?.defenseDeclarationPending).toBe(true);
    expect(getFabAutoPassPriorityCommand(game.getRuntime())).toBeNull();
  });

  it("returns pass for a response-free combat priority window", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).pass();

    expect(game.combat()?.open).toBe(true);
    expect(getFabAutoPassPriorityCommand(game.getRuntime())).toMatchObject({ move: "pass" });
  });
});

describe("own-skip policy (play-and-skip)", () => {
  it("passes the seat's own post-play window even while other actions remain legal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    game.as(bravo).play(snatchRed);

    const runtime = game.getRuntime();
    expect(runtime.getState().priority?.origin).toMatchObject({ kind: "own-action" });
    // Skipping a window that still has real options is exactly the contract.
    expect(getFabAutoPassPriorityCommand(runtime, { kind: "own-skip" })).toMatchObject({
      move: "pass",
    });
    // The pass-only policy still refuses the same window (contrast).
    expect(getFabAutoPassPriorityCommand(runtime, { kind: "pass-only" })).toBeNull();
  });

  it("never drains a pass-only response window (bluff preservation)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    game.as(bravo).play(snatchRed);
    game.as(bravo).pass();

    const runtime = game.getRuntime();
    // Dash now holds an unstamped, pass-only response layer window.
    expect(runtime.getState().priority?.holderPlayerId).toBe(game.as(dash).id);
    expect(runtime.getState().priority?.origin).toBeUndefined();
    expect(getFabAutoPassPriorityCommand(runtime, { kind: "own-skip" })).toBeNull();
    // Contrast: the auto-pass policy drains the identical window.
    expect(getFabAutoPassPriorityCommand(runtime, { kind: "pass-only" })).toMatchObject({
      move: "pass",
    });
  });

  it("holds the seat's own window while its one-shot hold is armed", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    game.as(bravo).play(snatchRed);

    const state = game.getRuntime().cloneState();
    state.priorityHoldArmed = { [game.as(bravo).id]: true };
    const runtime = new FabMatchRuntime(state);
    expect(runtime.getState().priority?.origin).toMatchObject({ kind: "own-action" });
    expect(getFabAutoPassPriorityCommand(runtime, { kind: "own-skip" })).toBeNull();
  });

  it("holds the seat's own window when the played card is per-card excepted", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, nimbleStrikeRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
      playAndSkipHoldCardIds: [snatchRed.canonicalId],
    };

    // The excepted card's own window is held inside the play receipt...
    const excepted = game.as(bravo).play(snatchRed, { target: dashId });
    expect(excepted).toMatchObject({ accepted: true });
    expect(game.getPriorityPlayerId()).toBe(bravoId);
    // ...and the derivation refuses to skip it.
    const runtime = game.getRuntime();
    expect(runtime.getState().priority?.origin).toMatchObject({ kind: "own-action" });
    expect(getFabAutoPassPriorityCommand(runtime, { kind: "own-skip" })).toBeNull();
  });

  it("still skips the seat's own window for a card that is not excepted", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
      playAndSkipHoldCardIds: ["some-other-card"],
    };

    const ordinary = game.as(bravo).play(snatchRed, { target: dashId });
    expect(ordinary).toMatchObject({ accepted: true });
    expect(game.getPriorityPlayerId()).toBe(dashId);
  });

  it("never automates the terminal Action-Phase window under own-skip", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 4 }, { hero: dash, deck: 4 }, manual);

    expect(getFabAutoPassPriorityCommand(game.getRuntime(), { kind: "own-skip" })).toBeNull();
  });

  it("decides the skip without the full legal-command enumeration", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    game.as(bravo).play(snatchRed);

    const spy = vi.mocked(listLegalCommands);
    spy.mockClear();
    expect(getFabAutoPassPriorityCommand(game.getRuntime(), { kind: "own-skip" })).toMatchObject({
      move: "pass",
    });
    expect(spy).not.toHaveBeenCalled();
  });
});
