import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04Cavendish081, op04Gyats080 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-080 Gyats", () => {
  test("lets only a Dressrosa Character attack active Characters for this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04Gyats080],
        character: [
          { card: op04Cavendish081, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const cavendishId = engine.findCardInZone("south", "character", op04Cavendish081);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const activeTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op04Gyats080, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Gyats's target choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(cavendishId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(domaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [cavendishId] }, "south");

    engine.declareAttack(cavendishId, activeTargetId, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === activeTargetId),
    ).toBe(true);

    engine.endTurn("south");
    engine.endTurn("north");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: cavendishId,
        targetId: activeTargetId,
      }).accepted,
    ).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
