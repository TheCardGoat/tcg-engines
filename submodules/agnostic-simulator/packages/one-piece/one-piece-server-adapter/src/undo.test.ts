import { describe, expect, it } from "vite-plus/test";
import { createMatch, createSt01MirrorPracticeConfig } from "@tcg/op-engine";
import type { DispatchContext } from "@tcg/shared/game-engine";
import {
  onePieceRestoreEngine,
  onePieceSerializeEngine,
} from "./one-piece-engine-lifecycle";
import { OnePieceServerEngine } from "./one-piece-server-engine";
import { hasOnePieceUndoBarrier } from "./undo";
import { readOnePieceUndoState } from "./undo";

const context: DispatchContext = { gameId: "one-piece-undo-test", sourceAuthority: "server" };

function activeEngine(): OnePieceServerEngine {
  const config = createSt01MirrorPracticeConfig({ firstPlayer: "south", seed: "undo-test" });
  const engine = new OnePieceServerEngine(
    createMatch({
      ...config,
      players: {
        south: { ...config.players.south, playerName: "player1" },
        north: { ...config.players.north, playerName: "player2" },
      },
    }),
    { player1: "south", player2: "north" },
  );
  for (let step = 0; step < 8 && engine.state.status === "setup"; step++) {
    expect(engine.takeAutomatedAction({ strategyId: "value-ranked" }, context).finalResult.success).toBe(
      true,
    );
  }
  expect(engine.state.status).toBe("active");
  return engine;
}

describe("hosted One Piece undo", () => {
  it("undoes a safe DON!! action and persists its turn checkpoint", async () => {
    const engine = activeEngine();
    const actor = engine.seatToPlayerId[engine.state.activeSeat];
    const leader = engine.state.players[engine.state.activeSeat].leaderInstanceId;
    const before = structuredClone(engine.state);

    expect(engine.dispatch("attachDon", actor, { targetId: leader, amount: 1 }, context).success).toBe(
      true,
    );
    expect(engine.canUndo(actor)).toBe(true);
    expect(engine.canUndoToTurnStart(actor)).toBe(true);
    const snapshot = onePieceSerializeEngine(engine, { cardInstances: {}, owners: {} });
    expect(readOnePieceUndoState(snapshot.metadata).checkpoints).toHaveLength(1);
    const restored = (await onePieceRestoreEngine(snapshot, {
      gameSlug: "one-piece",
      seed: "undo-test",
      player1Id: "player1",
      player2Id: "player2",
    })) as OnePieceServerEngine;
    expect(restored.canUndo(actor)).toBe(true);

    const previousVersion = restored.getStateID();
    const undone = restored.dispatch("undoToTurnStart", actor, {}, context);
    expect(undone.success).toBe(true);
    expect(restored.getStateID()).toBe(previousVersion + 1);
    expect(restored.state.players[restored.state.activeSeat].activeDon).toBe(
      before.players[before.activeSeat].activeDon,
    );
    expect(restored.canUndo(actor)).toBe(false);
    expect(undone).toMatchObject({
      acceptedMoveRecord: {
        transitionType: "undo",
        restoredCheckpointStateID: before.idCounter,
      },
    });
  });

  it("never restores through a secret-area change", () => {
    const engine = activeEngine();
    const actor = engine.seatToPlayerId[engine.state.activeSeat];
    const leader = engine.state.players[engine.state.activeSeat].leaderInstanceId;
    expect(engine.dispatch("attachDon", actor, { targetId: leader }, context).success).toBe(true);
    expect(engine.canUndo(actor)).toBe(true);

    const before = structuredClone(engine.state);
    const after = structuredClone(before);
    after.players[before.activeSeat].deck.reverse();
    expect(hasOnePieceUndoBarrier(before, after, [])).toBe(true);

    expect(engine.dispatch("endTurn", actor, {}, context).success).toBe(true);
    expect(engine.canUndo(actor)).toBe(false);
    expect(engine.dispatch("undo", actor, {}, context).success).toBe(false);
  });

  it("undoes a safe tail step by step and keeps the turn-start option", () => {
    const engine = activeEngine();
    const firstActor = engine.seatToPlayerId[engine.state.activeSeat];
    expect(engine.dispatch("endTurn", firstActor, {}, context).success).toBe(true);
    const secondActor = engine.seatToPlayerId[engine.state.activeSeat];
    expect(engine.dispatch("endTurn", secondActor, {}, context).success).toBe(true);
    expect(engine.seatToPlayerId[engine.state.activeSeat]).toBe(firstActor);
    const leader = engine.state.players[engine.state.activeSeat].leaderInstanceId;
    const initialDon = engine.state.players[engine.state.activeSeat].activeDon;

    expect(engine.dispatch("attachDon", firstActor, { targetId: leader }, context).success).toBe(true);
    expect(engine.dispatch("attachDon", firstActor, { targetId: leader }, context).success).toBe(true);
    expect(engine.canUndoToTurnStart(firstActor)).toBe(true);

    expect(engine.dispatch("undo", firstActor, {}, context).success).toBe(true);
    expect(engine.state.players[engine.state.activeSeat].activeDon).toBe(initialDon - 1);
    expect(engine.canUndoToTurnStart(firstActor)).toBe(true);
    expect(engine.dispatch("undo", firstActor, {}, context).success).toBe(true);
    expect(engine.state.players[engine.state.activeSeat].activeDon).toBe(initialDon);
    expect(engine.canUndo(firstActor)).toBe(false);
  });
});
