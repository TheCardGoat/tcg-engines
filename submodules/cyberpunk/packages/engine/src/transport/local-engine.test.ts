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
    expect(engine.getLocalEngine().getContinuationSnapshot().undoStack).toHaveLength(0);

    engine.playCard(p2Unit, { as: P2 });
    expect(engine.canUndo()).toBe(true);
    expect(engine.canUndoToTurnStart()).toBe(true);
    expect(engine.getLocalEngine().getContinuationSnapshot().undoStack).toHaveLength(1);

    expect(engine.undoToTurnStart()).toBe(true);
    expect(engine.getCardsInZone("hand", P2).map((card) => card.definitionId)).toContain(p2Unit.id);
    expect(engine.getCardsInZone("field", P2)).toHaveLength(0);
  });

  it("keeps undo available after a hidden-information reveal", () => {
    const legend = createMockLegend({ name: "Hidden Legend" });
    const unit = createMockUnit({ name: "After Reveal Unit", cost: 0 });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [unit],
      legendArea: [legend],
      eddies: 2,
      deck: 10,
    });

    engine.callLegend(legend, { as: P1 });
    expect(engine.canUndo()).toBe(true);
    expect(engine.getFaceDownLegends(P1)).toHaveLength(0);

    expect(engine.undo()).toBe(true);
    expect(engine.getFaceDownLegends(P1)).toHaveLength(1);

    engine.callLegend(legend, { as: P1 });
    engine.playCard(unit, { as: P1 });
    expect(engine.canUndo()).toBe(true);
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

describe("LocalEngine board-correction rewind", () => {
  it("restores the in-memory turn-start checkpoint and bumps stateID", () => {
    const first = createMockUnit({ name: "First Unit", cost: 0 });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [first], deck: 10 });
    const local = engine.getLocalEngine();
    const handBefore = engine.getCardsInZone("hand", P1).map((card) => card.definitionId);
    const turnBefore = engine.getState().G.turnMetadata.turnNumber;
    const stateIDBefore = engine.getState().ctx.stateID;

    engine.playCard(first, { as: P1 });
    const stateIDAfterMove = engine.getState().ctx.stateID;
    expect(stateIDAfterMove).toBe(stateIDBefore + 1);
    expect(engine.getCardsInZone("field", P1)).toHaveLength(1);
    expect(local.hasTurnStartCheckpoint()).toBe(true);

    const outcome = local.restoreToTurnStart();
    expect(outcome).toEqual({ success: true, restoredTurnNumber: turnBefore });
    expect(engine.getCardsInZone("field", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual(handBefore);
    // The restore is a fresh engine version so remote sync treats it as new.
    expect(engine.getState().ctx.stateID).toBe(stateIDAfterMove + 1);
    // The checkpoint stays valid for the same turn: a second rewind is a no-op.
    expect(local.hasTurnStartCheckpoint()).toBe(true);
    // Undo history earlier than the checkpoint is gone.
    expect(engine.canUndo()).toBe(false);
  });

  it("never exposes the checkpoint through the match state or its serialization", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [createMockUnit()], deck: 10 });
    engine.getLocalEngine().restoreToTurnStart();
    const raw = JSON.stringify(engine.getState());
    expect(raw).not.toContain("turnStartCheckpoint");
    expect(raw).not.toContain("stackDepth");
    expect(engine.getState()).not.toHaveProperty("turnStartCheckpoint");
  });

  it("reports NO_TURN_START_CHECKPOINT before any main/start-phase checkpoint exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ deck: 10 }, {}, { skipSetup: false });
    expect(engine.getState().G.gamePhase).toBe("setup");
    const outcome = engine.getLocalEngine().restoreToTurnStart();
    expect(outcome.success).toBe(false);
    if (outcome.success) return;
    expect(outcome.errorCode).toBe("NO_TURN_START_CHECKPOINT");
  });
});
