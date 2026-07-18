import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04Hajrudin088 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-088 Hajrudin", () => {
  test("rests its Leader to reduce an opposing Character's cost for this turn", () => {
    expect(op04Hajrudin088.traits).toEqual(["Giant", "Dressrosa", "New Giant Pirates"]);
    const engine = OnePieceTestEngine.create(
      { character: [op04Hajrudin088] },
      { character: [eb01MountainGod018] },
    );
    const hajrudinId = engine.findCardInZone("south", "character", op04Hajrudin088);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const originalCost = engine.getView("south").players.north.characters[0]?.cost;

    engine.activateEffect(hajrudinId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hajrudin's target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.leader.rested).toBe(true);
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe((originalCost ?? 0) - 4);
    engine.endTurn("south");
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(originalCost);
  });

  test("may pay the Leader-rest cost and choose no opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Hajrudin088] },
      { character: [eb01MountainGod018] },
    );
    const sourceId = engine.findCardInZone("south", "character", op04Hajrudin088);
    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south.leader.rested).toBe(true);
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(5);
  });

  test("may decline without resting its Leader and cannot activate with a rested Leader", () => {
    const declined = OnePieceTestEngine.create({ character: [op04Hajrudin088] });
    const declinedId = declined.findCardInZone("south", "character", op04Hajrudin088);
    declined.activateEffect(declinedId, "activateMain", "south");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(declined.getView("south").players.south.leader.rested).toBe(false);

    const unavailable = OnePieceTestEngine.create(
      { character: [op04Hajrudin088] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    unavailable.declareAttack(unavailable.leader("south"), unavailable.leader("north"), "south");
    expect(
      unavailable.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: unavailable.findCardInZone("south", "character", op04Hajrudin088),
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
