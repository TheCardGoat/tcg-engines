import { describe, expect, it } from "vitest";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import { RiftboundServerEngine, createRiftboundServerEngine,
  restoreRiftboundServerEngine, riftboundSnapshotFromClientAuthorityState,
  serializeRiftboundServerEngine } from "./engine";

const maps: CardsMaps = {
  cardInstances: { "p1-0": "legend", "p1-1": "unit", "p2-0": "unit" },
  owners: { p1: ["p1-0", "p1-1"], p2: ["p2-0"] },
};
const context = { gameId: "riftbound-undo", sourceAuthority: "server" as const };

function engine(): RiftboundServerEngine {
  return createRiftboundServerEngine({
    gameSlug: "riftbound", seed: "test", player1Id: "p1", player2Id: "p2", cardsMaps: maps,
  }, {
    legend: { name: "Legend", cardType: "legend", domains: [] },
    unit: { name: "Unit", cardType: "unit", domains: [] },
  });
}

describe("Riftbound hosted tabletop undo", () => {
  it("restores safe actions and the turn marker across snapshots", async () => {
    const game = engine();
    expect(game.dispatch("start_turn", "p1", {}, context).success).toBe(true);
    const turnStart = structuredClone(game.state);
    expect(game.dispatch("rotate", "p1", { cardId: "p1-0", rotation: 90 }, context).success).toBe(true);
    expect(game.dispatch("set_counter", "p1", { cardId: "p1-0", counter: "test", value: 1 }, context).success).toBe(true);
    expect(game.canUndo("p1")).toBe(true);
    expect(game.canUndoToTurnStart("p1")).toBe(true);
    const saved = serializeRiftboundServerEngine(game, maps);
    const restored = await restoreRiftboundServerEngine(saved, {
      gameSlug: "riftbound", seed: "test", player1Id: "p1", player2Id: "p2",
    });
    if (!(restored instanceof RiftboundServerEngine)) throw new Error("Wrong restored engine.");
    const priorVersion = restored.getStateID();
    expect(restored.dispatch("undo", "p2", {}, context).success).toBe(false);
    expect(restored.dispatch("undo", "p1", {}, context).success).toBe(true);
    expect(restored.getStateID()).toBe(priorVersion + 1);
    expect(restored.state.cards["p1-0"]?.counters.test).toBeUndefined();
    expect(restored.dispatch("undoToTurnStart", "p1", {}, context).success).toBe(true);
    expect(restored.state).toEqual(turnStart);
    expect(restored.canUndo("p1")).toBe(false);
  });

  it("keeps private cards hidden and closes turn undo after a draw", () => {
    const game = engine();
    game.dispatch("start_turn", "p1", {}, context);
    const playerView = game.getViewerState({ role: "player", actorId: "p1" }) as {
      cards: Record<string, { cardId: string }>;
    };
    expect(JSON.stringify(playerView)).not.toContain('"cardId":"unit","ownerId":"p2"');
    expect(playerView.cards["p1-1"]?.cardId).toBe("hidden");
    expect(playerView.cards["p1-0"]?.cardId).toBe("legend");
    expect(game.dispatch("draw", "p1", { ownerId: "p1", count: 1 }, context).success).toBe(true);
    const drawn = game.getViewerState({ role: "player", actorId: "p1" }) as {
      cards: Record<string, { cardId: string; zone: string }>;
    };
    expect(drawn.cards["p1-1"]).toMatchObject({ cardId: "unit", zone: "hand" });
    expect(game.dispatch("rotate", "p1", { cardId: "p1-0", rotation: 90 }, context).success).toBe(true);
    expect(game.canUndo("p1")).toBe(true);
    expect(game.canUndoToTurnStart("p1")).toBe(false);
  });

  it("keeps turn undo after the last-move window is capped", () => {
    const game = engine();
    expect(game.dispatch("start_turn", "p1", {}, context).success).toBe(true);
    const rotations = [90, 180, 270, 0] as const;
    for (let step = 0; step < 26; step += 1) {
      expect(game.dispatch("rotate", "p1", {
        cardId: "p1-0", rotation: rotations[step % rotations.length],
      }, context).success).toBe(true);
    }
    expect(game.getUndoState().checkpoints).toHaveLength(25);
    expect(game.canUndoToTurnStart("p1")).toBe(true);
    expect(game.dispatch("undoToTurnStart", "p1", {}, context).success).toBe(true);
    expect(game.state.cards["p1-0"]?.rotation).toBe(0);
  });

  it("keeps undo available after a public statement", () => {
    const game = engine();
    expect(game.dispatch("start_turn", "p1", {}, context).success).toBe(true);
    expect(game.dispatch("rotate", "p1", { cardId: "p1-0", rotation: 90 }, context).success).toBe(true);
    expect(game.dispatch("publish_statement", "p1", {
      statementId: "talk-1", text: "That rotate was a misclick.",
    }, context).success).toBe(true);
    expect(game.canUndo("p1")).toBe(true);
    expect(game.canUndoToTurnStart("p1")).toBe(true);
  });

  it("restores a pre-turn client snapshot at the stored Redis version", async () => {
    const game = engine();
    const saved = serializeRiftboundServerEngine(game, maps);
    const legacy = saved.state as { turn?: unknown; stateVersion?: unknown };
    delete legacy.turn;
    delete legacy.stateVersion;
    const adopted = riftboundSnapshotFromClientAuthorityState(JSON.stringify({
      state: legacy,
      cardsMaps: maps,
    }), 4, { player1Id: "p1", player2Id: "p2" });
    if (!adopted) throw new Error("Expected the client snapshot to adopt.");
    const restored = await restoreRiftboundServerEngine(adopted, {
      gameSlug: "riftbound", seed: "test", player1Id: "p1", player2Id: "p2",
    });
    if (!(restored instanceof RiftboundServerEngine)) throw new Error("Wrong restored engine.");
    expect(restored.getStateID()).toBe(4);
    expect(restored.state.turn).toEqual({ number: 0, actorId: null, startedAt: null });
    expect(restored.dispatch("rotate", "p1", { cardId: "p1-0", rotation: 90 }, context).success).toBe(true);
  });
});
