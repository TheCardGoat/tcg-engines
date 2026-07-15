import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2, createMockLegend, createMockUnit } from "../testing/index.ts";
import { createTestMatchState } from "../testing/test-state.ts";
import { LocalEngine } from "./local-engine.ts";

function resolvePendingGainGig(engine: CyberpunkTestEngine) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("gainGig");
  if (!choice || choice.type !== "gainGig") throw new Error("Expected gainGig choice");
  return engine.gainGig(choice.payload.allowedDieIds[0]!, { as: choice.chooserId });
}

describe("LocalEngine undo history", () => {
  it("rewinds multiple main-phase moves to the current turn start checkpoint", () => {
    const first = createMockUnit({ name: "First Unit", cost: 0 });
    const second = createMockUnit({ name: "Second Unit", cost: 0 });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [first, second], deck: 10 });

    engine.playCard(first, { as: P1 });
    engine.playCard(second, { as: P1 });

    expect(engine.canUndo()).toBe(true);
    expect(engine.canUndoToTurnStart()).toBe(true);

    expect(engine.undoToTurnStart()).toBe(true);

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      first.id,
      second.id,
    ]);
    expect(engine.getCardsInZone("field", P1)).toHaveLength(0);
    expect(engine.canUndo()).toBe(false);
    expect(engine.canUndoToTurnStart()).toBe(false);
  });

  it("creates a clean turn-start checkpoint after start-phase draw and gig gain", () => {
    const p2Unit = createMockUnit({ name: "Rival Unit", cost: 0 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: 10 },
      { hand: [p2Unit], deck: 10 },
      { autoGainGig: false },
    );

    engine.completeTurn({ as: P1 });
    expect(engine.getPhase()).toBe("start");
    expect(engine.canUndo()).toBe(false);

    resolvePendingGainGig(engine);
    expect(engine.getPhase()).toBe("main");
    expect(engine.canUndo()).toBe(false);
    expect(engine.canUndoToTurnStart()).toBe(false);

    engine.playCard(p2Unit, { as: P2 });
    expect(engine.canUndo()).toBe(true);
    expect(engine.canUndoToTurnStart()).toBe(true);

    expect(engine.undoToTurnStart()).toBe(true);
    expect(engine.getCardsInZone("hand", P2).map((card) => card.definitionId)).toContain(p2Unit.id);
    expect(engine.getCardsInZone("field", P2)).toHaveLength(0);
  });

  it("turns hidden-information reveals into an undo barrier while allowing later moves", () => {
    const legend = createMockLegend({ name: "Hidden Legend" });
    const unit = createMockUnit({ name: "After Reveal Unit", cost: 0 });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [unit],
      legendArea: [legend],
      eddies: 2,
      deck: 10,
    });

    engine.callLegend(legend, { as: P1 });
    expect(engine.canUndo()).toBe(false);
    expect(engine.canUndoToTurnStart()).toBe(false);

    engine.playCard(unit, { as: P1 });
    expect(engine.canUndo()).toBe(true);
    expect(engine.canUndoToTurnStart()).toBe(false);

    expect(engine.undo()).toBe(true);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(unit.id);
    expect(engine.getFaceDownLegends(P1)).toHaveLength(0);
  });
});

describe("LocalEngine dynamic time control", () => {
  it("charges elapsed time, grants action bonuses, and allows expired actors to keep playing", () => {
    const state = createTestMatchState(
      { deck: 10 },
      { deck: 10 },
      {
        skipSetup: true,
        activePlayerId: P1,
        timeControl: {
          mode: "dynamic",
          config: {
            initialReserveMs: 1_000,
            reserveCapMs: 2_000,
            perActionBonusMs: 100,
            perTurnPassBonusMs: 500,
            resetTimeOnSkipMs: 0,
            graceMs: 0,
          },
        },
      },
    );
    const p1Clock = state.ctx.clockState![P1 as string]!;
    p1Clock.lastUpdatedAtMs = 1_000;

    const engine = new LocalEngine(state);
    const passToAttack = engine.processCommand(
      {
        commandID: "p1-pass-play",
        move: "passPhase",
        timestamp: 1_250,
      },
      P1,
    );

    expect(passToAttack.success).toBe(true);
    // Single passPhase from main grants both action bonus and turn-pass bonus.
    expect(engine.getState().ctx.clockState![P1 as string]!.reserveMsRemaining).toBe(1_350);
    expect(engine.getState().ctx.clockState![P1 as string]!.actionBonusMsGranted).toBe(100);
    expect(engine.getState().ctx.clockState![P1 as string]!.turnPassBonusMsGranted).toBe(500);

    const expiredState = createTestMatchState(
      { deck: 10 },
      { deck: 10 },
      {
        skipSetup: true,
        activePlayerId: P1,
        timeControl: {
          mode: "dynamic",
          config: {
            initialReserveMs: 1_000,
            reserveCapMs: 2_000,
            perActionBonusMs: 0,
            perTurnPassBonusMs: 0,
            resetTimeOnSkipMs: 0,
            graceMs: 0,
          },
        },
      },
    );
    const expiredClock = expiredState.ctx.clockState![P1 as string]!;
    expiredClock.lastUpdatedAtMs = 2_000;
    expiredClock.reserveMsRemaining = 10;

    const expiredEngine = new LocalEngine(expiredState);
    const expired = expiredEngine.processCommand(
      {
        commandID: "expired-pass",
        move: "passPhase",
        timestamp: 2_011,
      },
      P1,
    );

    expect(expired.success).toBe(true);
    expect(expiredEngine.getState().ctx.clockState![P1 as string]!.reserveMsRemaining).toBe(-1);
    expect(expiredEngine.getState().G.gameEnded).toBe(false);
  });
});
