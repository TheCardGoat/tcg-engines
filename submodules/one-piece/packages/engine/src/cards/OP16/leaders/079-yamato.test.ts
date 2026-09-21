import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-079", () => {
  test("a {Land of Wano} Character played from the hand gains no Rush", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-079", hand: ["OP16-095"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP16-095");
    // Decline OP16-095's own [On Play] Unblockable grant.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const luffyId = engine.findCardInZone("south", "character", "OP16-095");

    // Played from the hand, not the trash: no [Rush], so the attack is illegal.
    expect(() => engine.asSouth().attack(luffyId, higumaId)).toThrow();
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      luffyId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("the Leader battles and deals damage normally", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-079", activeDon: 5 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
