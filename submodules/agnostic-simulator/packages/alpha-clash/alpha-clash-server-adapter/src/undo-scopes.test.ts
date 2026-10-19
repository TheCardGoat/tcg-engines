import { expect, it } from "vite-plus/test";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
import { alphaClashSerializeEngine, alphaClashRestoreEngine } from "./alpha-clash-engine-lifecycle";
const context = { gameId: "undo-scopes", sourceAuthority: "server" as const };
function fixture() {
  const g = Spec.fromFixture({
    phase: { name: "expansion", step: "resource" },
    playerOne: { resource: 8, deck: 8 },
    playerTwo: { deck: 8 },
  });
  return new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
}
async function saved(engine: AlphaClashServerEngine, keepHistory = true) {
  const snapshot = alphaClashSerializeEngine(engine, { cardInstances: {}, owners: {} });
  if (!keepHistory) delete snapshot.metadata;
  const restored = await alphaClashRestoreEngine(JSON.parse(JSON.stringify(snapshot)), {
    player1Id: "p1",
    player2Id: "p2",
    gameSlug: "alpha-clash",
  });
  if (!(restored instanceof AlphaClashServerEngine)) throw new Error("Wrong engine");
  return restored;
}
it.each(["undo", "undoToTurnStart"])(
  "restores %s after JSON save with a fresh monotonic version",
  async (move) => {
    const engine = fixture();
    const turnStart = structuredClone(engine.state);
    expect(engine.dispatch("pass", "p1", {}, context).success).toBe(true);
    const beforePortal = structuredClone(engine.state);
    expect(engine.dispatch("activatePortal", "p1", {}, context).success).toBe(true);
    expect(engine.state.portalOpen).toBe(true);
    const restored = await saved(engine);
    expect(restored.canUndo("p1")).toBe(true);
    expect(restored.canUndoToTurnStart("p1")).toBe(true);
    const version = restored.getStateID();
    const before = structuredClone(restored.state);
    expect(restored.dispatch(move, "p2", {}, context).success).toBe(false);
    expect(restored.dispatch(move, "stranger", {}, context).success).toBe(false);
    expect(restored.state).toEqual(before);
    const result = restored.dispatch(move, "p1", {}, context);
    expect(result.success).toBe(true);
    const expected = move === "undo" ? beforePortal : turnStart;
    expect(restored.state).toEqual({ ...expected, stateID: version + 1 });
    if (result.success)
      expect(result.acceptedMoveRecord).toMatchObject({
        moveId: move,
        transitionType: "undo",
        newStateID: version + 1,
      });
    expect(restored.canUndo("p1")).toBe(move === "undo");
    if (move === "undo") {
      expect(restored.dispatch("undo", "p1", {}, context).success).toBe(true);
      expect(restored.state).toEqual({ ...turnStart, stateID: version + 2 });
    }
  },
);
it("does not invent a turn-start checkpoint for a legacy mid-turn snapshot", async () => {
  const engine = fixture();
  expect(engine.dispatch("pass", "p1", {}, context).success).toBe(true);
  const restored = await saved(engine, false);
  expect(restored.dispatch("activatePortal", "p1", {}, context).success).toBe(true);
  expect(restored.canUndo("p1")).toBe(true);
  expect(restored.canUndoToTurnStart("p1")).toBe(false);
  const before = structuredClone(restored.state);
  expect(restored.dispatch("undoToTurnStart", "p1", {}, context).success).toBe(false);
  expect(restored.state).toEqual(before);
  expect(restored.dispatch("undo", "p1", {}, context).success).toBe(true);
  expect(restored.state.phase.name).toBe("primary");
  expect(restored.dispatch("endTurn", "p1", {}, context).success).toBe(true);
  const nextTurn = structuredClone(restored.state);
  expect(restored.getActivePlayerId()).toBe("p2");
  expect(restored.dispatch("pass", "p2", {}, context).success).toBe(true);
  expect(restored.canUndoToTurnStart("p2")).toBe(true);
  const version = restored.getStateID();
  expect(restored.dispatch("undoToTurnStart", "p2", {}, context).success).toBe(true);
  expect(restored.state).toEqual({ ...nextTurn, stateID: version + 1 });
});
