import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op03Kalifa081 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function playKalifa() {
  const engine = OnePieceTestEngine.create(
    {
      hand: [op03Kalifa081, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op03Kalifa081.cost,
    },
    { character: [eb01Fourtricks025] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
  const firstDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
  const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);
  const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

  engine.playCard(op03Kalifa081, "south");
  const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
  expect(trash?.kind).toBe("selectEntity");
  if (trash?.kind !== "selectEntity") throw new Error("Expected Kalifa's hand-trash choice.");
  expect(trash).toMatchObject({ min: 2, max: 2 });
  expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
    expect.arrayContaining([retainedId, firstDrawId, secondDrawId]),
  );
  engine.resolveDecision(
    "effectTrashFromHandSelection",
    { selectedIds: [firstDrawId, secondDrawId] },
    "south",
  );

  return { engine, retainedId, firstDrawId, secondDrawId, targetId };
}

describe("OP03-081 Kalifa", () => {
  test("draws two, trashes the chosen two, then reduces an opposing Character cost for this turn", () => {
    const { engine, retainedId, firstDrawId, secondDrawId, targetId } = playKalifa();
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Kalifa's cost target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      1,
    );

    engine.endTurn("south");
    view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );
  });

  test("may choose no opposing Character after completing the draw and trash", () => {
    const { engine, targetId } = playKalifa();
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
