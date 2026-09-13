import { describe, expect, it } from "vitest";
import {
  FabMatchRuntime,
  createFabMatchContext,
  projectFabViewerState,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
  type FabCommand,
} from "./runtime-api.ts";
import { FabTestEngine } from "./testing/index.ts";
import {
  bravo,
  crackedBaubleYellow,
  dash,
  nimbleStrikeRed,
  optekalMonocle,
  snatchRed,
} from "./rules/fixtures.ts";
import { ponder } from "../../cards/src/cards/tokens/ponder.ts";

function restore(runtime: FabMatchRuntime): FabMatchRuntime {
  const state = runtime.getState();
  return new FabMatchRuntime(
    restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    ),
  );
}

function applyBoth(
  uninterrupted: FabMatchRuntime,
  restored: FabMatchRuntime,
  actorId: string,
  command: FabCommand,
): void {
  const uninterruptedResult = uninterrupted.applyCommand(actorId, command);
  const restoredResult = restored.applyCommand(actorId, command);

  expect(uninterruptedResult).toMatchObject({ success: true });
  expect(restoredResult).toMatchObject({ success: true });
  if (!uninterruptedResult.success || !restoredResult.success) {
    throw new Error("Expected both lifecycle commands to succeed.");
  }
  const { state: _uninterruptedState, ...uninterruptedReceipt } = uninterruptedResult;
  const { state: _restoredState, ...restoredReceipt } = restoredResult;
  expect(restoredReceipt).toEqual(uninterruptedReceipt);
  expect(serializeFabMatchSnapshot(restored.getState())).toEqual(
    serializeFabMatchSnapshot(uninterrupted.getState()),
  );
  expect(projectFabViewerState(restored.getState(), { role: "spectator" })).toEqual(
    projectFabViewerState(uninterrupted.getState(), { role: "spectator" }),
  );
}

function declineArsenalBoth(uninterrupted: FabMatchRuntime, restored: FabMatchRuntime): void {
  const decision = uninterrupted.getState().decision;
  const restoredDecision = restored.getState().decision;
  if (
    !decision ||
    !restoredDecision ||
    decision.kind !== "entity-target" ||
    restoredDecision.kind !== "entity-target" ||
    decision.continuation.kind !== "turn-arsenal" ||
    restoredDecision.continuation.kind !== "turn-arsenal"
  ) {
    throw new Error("Expected matching persisted Arsenal choices.");
  }
  applyBoth(uninterrupted, restored, decision.actorId, {
    move: "answer-decision",
    decisionId: decision.decisionId,
    stateVersion: decision.stateVersion,
    answer: { kind: "entity-target", instanceIds: [] },
  });
}

describe("FAB lifecycle baseline across compact restore", () => {
  it("preserves an ordinary real-hero priority pass", () => {
    const fixture = FabTestEngine.start(
      { hero: bravo, deck: 8 },
      { hero: dash, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const uninterrupted = fixture.getRuntime();
    const restored = restore(uninterrupted);

    expect(uninterrupted.getState().firstTurnPlayerId).toBe(fixture.as(bravo).id);
    expect(restored.getState().firstTurnPlayerId).toBe(fixture.as(bravo).id);

    applyBoth(uninterrupted, restored, fixture.as(bravo).id, { move: "pass" });
  });

  it("ends the Action Phase after both players pass and remains compact-restorable", () => {
    const fixture = FabTestEngine.start(
      { hero: bravo, deck: 8 },
      { hero: dash, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const firstPlayerId = fixture.as(bravo).id;
    const secondPlayerId = fixture.as(dash).id;
    const uninterrupted = fixture.getRuntime();

    const firstPass = uninterrupted.applyCommand(firstPlayerId, { move: "pass" });
    expect(firstPass).toMatchObject({ success: true });
    const restored = restore(uninterrupted);

    applyBoth(uninterrupted, restored, secondPlayerId, { move: "pass" });
    declineArsenalBoth(uninterrupted, restored);
    expect(uninterrupted.getState()).toMatchObject({
      activePlayerId: secondPlayerId,
      priority: {
        kind: "action",
        holderPlayerId: secondPlayerId,
        consecutivePasses: 0,
      },
      turnNumber: 2,
    });
  });

  it("preserves a pending real-card payment decision and its accepted answer", () => {
    const fixture = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, crackedBaubleYellow],
        deck: 8,
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = fixture.as(bravo).id;
    const targetId = fixture.as(dash).id;
    const attackId = fixture.findCardInZone(actorId, "hand", nimbleStrikeRed.canonicalId);
    const pitchId = fixture.findCardInZone(actorId, "hand", crackedBaubleYellow.canonicalId);

    const announced = fixture.getRuntime().applyCommand(actorId, {
      move: "begin-play",
      instanceId: attackId,
      target: targetId,
    });
    expect(announced).toMatchObject({ success: true, status: "awaiting-decision" });
    expect(fixture.getState().decision).toMatchObject({ kind: "payment", actorId });

    const uninterrupted = fixture.getRuntime();
    const restored = restore(uninterrupted);
    const decision = uninterrupted.getState().decision;
    if (!decision || decision.kind !== "payment") {
      throw new Error("Expected a persisted FAB payment decision.");
    }

    applyBoth(uninterrupted, restored, actorId, {
      move: "answer-decision",
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "payment", instanceIds: [pitchId] },
    });
  });

  it("preserves a real attack through damage, hidden draw, and combat-chain close", () => {
    const fixture = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 8, actionPoints: 1 },
      { hero: dash, life: 20, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attackerId = fixture.as(bravo).id;
    const defenderId = fixture.as(dash).id;
    const attackId = fixture.findCardInZone(attackerId, "hand", snatchRed.canonicalId);

    fixture.as(bravo).attackWith(snatchRed);
    expect(fixture.getState().combat).not.toBeNull();

    const uninterrupted = fixture.getRuntime();
    const restored = restore(uninterrupted);
    for (let passes = 0; uninterrupted.getState().combat; passes += 1) {
      if (passes >= 20) throw new Error("Combat did not close within the bounded pass sequence.");
      const actorId = uninterrupted.getState().priority?.holderPlayerId;
      if (!actorId) {
        expect(uninterrupted.getState().combat).toMatchObject({
          step: "defend",
          defenseDeclarationPending: true,
        });
        applyBoth(uninterrupted, restored, defenderId, {
          move: "defend",
          instanceIds: [],
        });
        continue;
      }
      applyBoth(uninterrupted, restored, actorId, { move: "pass" });
    }

    expect(uninterrupted.getState().players[defenderId].life).toBe(16);
    expect(uninterrupted.getState().containers.zonesByPlayerId[attackerId]!.hand).toHaveLength(1);
    expect(uninterrupted.getState().containers.zonesByPlayerId[attackerId]!.graveyard).toContain(
      attackId,
    );
  });

  it("preserves a real enter-arena replacement while an Item is on the stack", () => {
    const fixture = FabTestEngine.start(
      { hero: bravo, hand: [optekalMonocle], deck: 8, actionPoints: 1 },
      { hero: dash, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = fixture.as(bravo).id;
    const itemId = fixture.findCardInZone(actorId, "hand", optekalMonocle.canonicalId);
    const announced = fixture.getRuntime().applyCommand(actorId, {
      move: "begin-play",
      instanceId: itemId,
    });
    expect(announced).toMatchObject({ success: true });
    expect(fixture.getState().containers.zonesByPlayerId[actorId]!.stack).toContain(itemId);

    const uninterrupted = fixture.getRuntime();
    const restored = restore(uninterrupted);
    for (
      let passes = 0;
      uninterrupted.getState().containers.zonesByPlayerId[actorId]!.stack.length;
      passes += 1
    ) {
      if (passes >= 6) throw new Error("Item did not resolve within the bounded pass sequence.");
      const priorityPlayerId = uninterrupted.getState().priority?.holderPlayerId;
      if (!priorityPlayerId) throw new Error("An unresolved layer must have a priority player.");
      applyBoth(uninterrupted, restored, priorityPlayerId, { move: "pass" });
    }

    expect(uninterrupted.getState().containers.zonesByPlayerId[actorId]!.arena).toContain(itemId);
    expect(uninterrupted.getState().objects[itemId].counters).toContainEqual({
      kind: "named",
      name: "steam",
      count: 5,
    });
  });

  it("preserves a real end-phase trigger, its hidden draw, and the next-turn boundary", () => {
    const fixture = FabTestEngine.start(
      { hero: bravo, arena: [ponder], deck: 8 },
      { hero: dash, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = fixture.as(bravo).id;
    const nextPlayerId = fixture.as(dash).id;
    const ponderId = fixture.findCardInZone(actorId, "arena", ponder.canonicalId);
    const handBefore = fixture.getState().containers.zonesByPlayerId[actorId]!.hand.length;

    const ended = fixture.getRuntime().applyCommand(actorId, { move: "end-turn" });
    expect(ended).toMatchObject({ success: true });
    expect(fixture.getState().rulesStack).toHaveLength(1);

    const uninterrupted = fixture.getRuntime();
    const restored = restore(uninterrupted);
    for (let passes = 0; uninterrupted.getState().activePlayerId === actorId; passes += 1) {
      if (passes >= 12)
        throw new Error("End phase did not settle within the bounded pass sequence.");
      if (uninterrupted.getState().decision?.continuation.kind === "turn-arsenal") {
        declineArsenalBoth(uninterrupted, restored);
        continue;
      }
      const priorityPlayerId = uninterrupted.getState().priority?.holderPlayerId;
      if (!priorityPlayerId) throw new Error("A pending end-phase layer must have priority.");
      applyBoth(uninterrupted, restored, priorityPlayerId, { move: "pass" });
    }

    expect(uninterrupted.getState().activePlayerId).toBe(nextPlayerId);
    expect(uninterrupted.getState().containers.zonesByPlayerId[actorId]!.arena).not.toContain(
      ponderId,
    );
    expect(uninterrupted.getState().containers.zonesByPlayerId[actorId]!.graveyard).not.toContain(
      ponderId,
    );
    expect(uninterrupted.getState().objects[ponderId]).toBeUndefined();
    expect(uninterrupted.getState().containers.zonesByPlayerId[actorId]!.hand).toHaveLength(
      handBefore + 1,
    );
  });

  it("preserves terminal concession and winner identity", () => {
    const fixture = FabTestEngine.start({ hero: bravo, deck: 8 }, { hero: dash, deck: 8 });
    const concedingPlayerId = fixture.as(bravo).id;
    const winnerId = fixture.as(dash).id;
    const uninterrupted = fixture.getRuntime();
    const restored = restore(uninterrupted);

    applyBoth(uninterrupted, restored, concedingPlayerId, { move: "concede" });

    expect(uninterrupted.getState()).toMatchObject({
      gameEnded: true,
      winnerId,
      endReason: "concede",
    });
  });
});
