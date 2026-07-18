import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, eb03JewelryBonney017, op07JewelryBonney019 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-017 Jewelry Bonney", () => {
  test("activates DON!! and prevents the chosen Character from attacking through the next opposing turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07JewelryBonney019,
        hand: [eb03JewelryBonney017],
        activeDon: 5,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const protectedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb03JewelryBonney017, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Bonney's protected Character.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([protectedId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 4,
    });

    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: protectedId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(protectedId, engine.leader("south"), "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === protectedId)?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
