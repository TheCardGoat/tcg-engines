import { describe, expect, it, vi } from "vitest";
import { FabTestEngine, FAB_MANUAL_HARNESS } from "@tcg/flesh-and-blood-engine/testing";
import { fleshAndBloodStructuredCardsByCanonicalId } from "@tcg/flesh-and-blood-cards";
import { buildInteractionSubmission } from "@tcg/protocol";
import { createFabClock, readFabClock, fabRemainingMs } from "./clock.ts";
import { FleshAndBloodServerEngine } from "./server-engine.ts";
import { fleshAndBloodRestoreEngine, fleshAndBloodSerializeEngine } from "./engine-lifecycle.ts";

function card(slug: string) {
  const found = [...fleshAndBloodStructuredCardsByCanonicalId.values()].find(
    (c) => c.slug === slug,
  );
  if (!found) throw new Error(`Missing card ${slug}`);
  return found;
}
const azalea = card("azalea");
const levia = card("levia");
const dash = card("dash");
const deathDealer = card("death-dealer");
const dabbleInDarkness = card("dabble-in-darkness-red");
const arrow = card("searing-shot-red");
const pitch = card("nimblism-blue");
const context = { gameId: "hosted-death-dealer-undo", sourceAuthority: "server" } as const;

function setup() {
  const fixture = FabTestEngine.start(
    {
      hero: azalea,
      weapon1: [deathDealer],
      hand: [arrow, pitch],
      resourcePoints: 0,
      actionPoints: 1,
      deck: [pitch, arrow],
    },
    { hero: dash, hand: [], deck: [pitch, arrow] },
    FAB_MANUAL_HARNESS,
  );
  const actor = fixture.as(azalea).id;
  const opponent = fixture.as(dash).id;
  const engine = new FleshAndBloodServerEngine(fixture.getRuntime());
  const weapon = fixture.findCardInZone(actor, "weapon1", deathDealer.canonicalId);
  const pitched = fixture.findCardInZone(actor, "hand", pitch.canonicalId);
  return { engine, actor, opponent, weapon, pitched };
}
function answer(engine: FleshAndBloodServerEngine, actor: string, value: boolean | string[]) {
  const view = engine.getInteractionView(actor);
  const action = view.actions.find((a) => a.inputs.length > 0);
  if (!action) throw new Error(`No decision: ${JSON.stringify(view)}`);
  const result = engine.submitInteraction(
    actor,
    buildInteractionSubmission({ view, action, values: { answer: value } }),
    context,
  );
  expect(result).toMatchObject({ success: true });
  return result;
}
function resolveToOptional(engine: FleshAndBloodServerEngine, actor: string) {
  for (let i = 0; i < 4 && !engine.runtime.getState().decision; i++) {
    const priority = engine.runtime.getPriorityPlayerId();
    expect(engine.dispatch("pass", priority ?? actor, {}, context)).toMatchObject({
      success: true,
    });
  }
  expect(engine.runtime.getState().decision?.kind).toBe("boolean");
}

describe("hosted FAB undo", () => {
  it("blocks undo when Dabble in Darkness exposes the top deck card", () => {
    const fixture = FabTestEngine.start(
      {
        hero: levia,
        hand: [dabbleInDarkness],
        actionPoints: 1,
        deck: [pitch, pitch, pitch, pitch, pitch, pitch],
      },
      { hero: dash, hand: [], deck: [pitch, arrow] },
      FAB_MANUAL_HARNESS,
    );
    const actor = fixture.as(levia).id;
    const opponent = fixture.as(dash).id;
    const engine = new FleshAndBloodServerEngine(fixture.getRuntime());
    const attack = fixture.findCardInZone(actor, "hand", dabbleInDarkness.canonicalId);
    expect(engine.dispatch("begin-play", actor, { instanceId: attack, target: opponent }, context)).toMatchObject({
      success: true,
    });
    for (let i = 0; i < 6 && engine.runtime.getState().containers.zonesByPlayerId[actor]!.deck.length === 6; i++) {
      const priority = engine.runtime.getPriorityPlayerId();
      if (!priority) throw new Error("Priority holder is missing");
      expect(engine.dispatch("pass", priority, {}, context)).toMatchObject({ success: true });
    }
    expect(engine.runtime.getState().containers.zonesByPlayerId[actor]!.deck).toHaveLength(5);
    expect(engine.canUndo(actor)).toBe(false);
    expect(engine.canUndoToTurnStart(actor)).toBe(false);
  });

  it("steps back through two safe plays or restores the full turn", () => {
    const fixture = FabTestEngine.start(
      { hero: azalea, hand: [pitch, pitch], actionPoints: 2, deck: [arrow, pitch] },
      { hero: dash, hand: [], deck: [pitch, arrow] },
      FAB_MANUAL_HARNESS,
    );
    const actor = fixture.as(azalea).id;
    const engine = new FleshAndBloodServerEngine(fixture.getRuntime());
    const turnStart = engine.runtime.snapshot();
    const playTwice = () => {
      const playOne = engine.runtime.getState().containers.zonesByPlayerId[actor]?.hand[0];
      if (!playOne) throw new Error("First play is missing from hand");
      expect(engine.dispatch("begin-play", actor, { instanceId: playOne }, context)).toMatchObject({
        success: true,
      });
      for (let i = 0; i < 2; i++) {
        const priority = engine.runtime.getPriorityPlayerId();
        if (!priority) throw new Error("Priority holder is missing");
        expect(engine.dispatch("pass", priority, {}, context)).toMatchObject({ success: true });
      }
      const beforeSecond = engine.runtime.snapshot();
      const playTwo = engine.runtime.getState().containers.zonesByPlayerId[actor]?.hand[0];
      if (!playTwo) throw new Error("Second play is missing from hand");
      expect(engine.dispatch("begin-play", actor, { instanceId: playTwo }, context)).toMatchObject({
        success: true,
      });
      return beforeSecond;
    };

    const beforeSecond = playTwice();
    expect(engine.getUndoCheckpoints()).toHaveLength(2);
    expect(engine.canUndoToTurnStart(actor)).toBe(true);
    const version = engine.getStateID();
    expect(engine.dispatch("undo", actor, {}, context)).toMatchObject({
      success: true,
      stateID: version + 1,
      acceptedMoveRecord: { restoredCheckpointStateID: beforeSecond.stateID },
    });
    expect(engine.runtime.snapshot()).toMatchObject({
      containerModel: beforeSecond.containerModel,
      players: beforeSecond.players,
    });
    expect(engine.canUndo(actor)).toBe(true);
    expect(engine.dispatch("undo", actor, {}, context)).toMatchObject({
      success: true,
      acceptedMoveRecord: { restoredCheckpointStateID: turnStart.stateID },
    });
    expect(engine.runtime.snapshot()).toMatchObject({
      containerModel: turnStart.containerModel,
      players: turnStart.players,
    });
    expect(engine.canUndo(actor)).toBe(false);

    const replayTurnStart = engine.getTurnStartCheckpoint();
    if (!replayTurnStart) throw new Error("Restored turn start is missing");
    playTwice();
    expect(engine.canUndoToTurnStart(actor)).toBe(true);
    expect(engine.dispatch("undoToTurnStart", actor, {}, context)).toMatchObject({
      success: true,
      acceptedMoveRecord: { restoredCheckpointStateID: replayTurnStart.snapshot.stateID },
    });
    expect(engine.runtime.snapshot()).toMatchObject({
      containerModel: turnStart.containerModel,
      players: turnStart.players,
    });
  });

  it("restores a clean turn checkpoint after reload", async () => {
    const { engine, actor, weapon } = setup();
    const before = engine.runtime.snapshot();
    expect(engine.dispatch("activate", actor, { instanceId: weapon }, context)).toMatchObject({
      success: true,
    });
    expect(engine.canUndoToTurnStart(actor)).toBe(true);
    const state = engine.runtime.getState();
    const snapshot = fleshAndBloodSerializeEngine(engine, {
      cardInstances: Object.fromEntries(
        Object.entries(state.objects).map(([id, object]) => [id, object.canonicalId]),
      ),
      owners: Object.fromEntries(
        engine.runtime
          .playerIds()
          .map((id) => [id, Object.values(state.containers.zonesByPlayerId[id]!).flat()]),
      ),
    });
    const restored = await fleshAndBloodRestoreEngine(JSON.parse(JSON.stringify(snapshot)), {
      gameId: context.gameId,
    });
    expect(restored.canUndoToTurnStart?.(actor)).toBe(true);
    const version = restored.getStateID();
    expect(restored.dispatch("undoToTurnStart", actor, {}, context)).toMatchObject({
      success: true,
      stateID: version + 1,
      acceptedMoveRecord: {
        transitionType: "undo",
        restoredCheckpointStateID: before.stateID,
      },
    });
    expect(restored.canUndo?.(actor)).toBe(false);
    expect(restored.dispatch("activate", actor, { instanceId: weapon }, context)).toMatchObject({
      success: true,
    });
    expect(restored.canUndoToTurnStart?.(actor)).toBe(true);
  });

  it("keeps elapsed time and removes time bonuses when an action is undone", () => {
    const time = vi.spyOn(Date, "now").mockReturnValue(1_000);
    try {
      const setupGame = setup();
      const { actor, opponent, weapon, pitched } = setupGame;
      const engine = new FleshAndBloodServerEngine(
        setupGame.engine.runtime,
        createFabClock(
          {
            mode: "dynamic",
            initialReserveMs: 60_000,
            perActionBonusMs: 2_000,
            turnPassBonusMs: 0,
            extras: { reserveCapMs: 90_000 },
          },
          [actor, opponent],
          actor,
          1_000,
        ),
      );
      time.mockReturnValue(6_000);
      expect(engine.dispatch("activate", actor, { instanceId: weapon }, context).success).toBe(
        true,
      );
      answer(engine, actor, [pitched]);
      resolveToOptional(engine, actor);
      answer(engine, actor, false);
      time.mockReturnValue(11_000);
      expect(engine.undo(actor, context, engine.getStateID() - 1).success).toBe(false);
      expect(engine.undo(actor, context, engine.getStateID()).success).toBe(true);
      const clock = readFabClock(engine.getState());
      if (!clock) throw new Error("Missing hosted clock");
      expect(fabRemainingMs(clock, actor, 11_000)).toBe(50_000);
    } finally {
      time.mockRestore();
    }
  });
  it("undoes the paid Death Dealer activation after declining, survives persistence, and permits activation again", async () => {
    const { engine, actor, opponent, weapon, pitched } = setup();
    const before = engine.runtime.snapshot();
    expect(engine.dispatch("activate", actor, { instanceId: weapon }, context)).toMatchObject({
      success: true,
    });
    answer(engine, actor, [pitched]);
    resolveToOptional(engine, actor);
    answer(engine, actor, false);
    expect(engine.canUndo(actor)).toBe(true);
    expect(engine.canUndo(opponent)).toBe(false);
    const version = engine.getStateID();
    const state = engine.runtime.getState();
    const owners = Object.fromEntries(
      engine.runtime
        .playerIds()
        .map((id) => [id, Object.values(state.containers.zonesByPlayerId[id]!).flat()]),
    );
    const snapshot = fleshAndBloodSerializeEngine(engine, {
      cardInstances: Object.fromEntries(
        Object.entries(state.objects).map(([id, object]) => [id, object.canonicalId]),
      ),
      owners,
    });
    const restored = await fleshAndBloodRestoreEngine(JSON.parse(JSON.stringify(snapshot)), {
      gameId: context.gameId,
    });
    expect(restored.canUndo?.(actor)).toBe(true);
    expect(restored.dispatch("undo", opponent, {}, context)).toMatchObject({ success: false });
    const undone = restored.dispatch("undo", actor, {}, context);
    expect(undone).toMatchObject({
      success: true,
      stateID: version + 1,
      undoable: false,
      acceptedMoveRecord: { transitionType: "undo", restoredCheckpointStateID: before.stateID },
    });
    const view = restored.getState();
    expect(view).toMatchObject({ containerModel: before.containerModel, players: before.players });
    expect(restored.dispatch("activate", actor, { instanceId: weapon }, context)).toMatchObject({
      success: true,
    });
  });

  it("clears undo after Death Dealer reveals a new card by drawing", () => {
    const { engine, actor, opponent, weapon, pitched } = setup();
    expect(engine.dispatch("activate", actor, { instanceId: weapon }, context)).toMatchObject({
      success: true,
    });
    answer(engine, actor, [pitched]);
    resolveToOptional(engine, actor);
    answer(engine, actor, true);
    expect(engine.runtime.getState().containers.zonesByPlayerId[actor]!.arsenal).toHaveLength(1);
    expect(engine.canUndo(actor)).toBe(false);
    expect(engine.dispatch("undo", actor, {}, context)).toMatchObject({ success: false });
  });
});
