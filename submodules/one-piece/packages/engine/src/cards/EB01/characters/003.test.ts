import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB01-003", () => {
  test("[Rush] with the opponent at 2 Life, [When Attacking] boosts past a 6000 blocker", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB01-003"], activeDon: 4 },
      {
        character: [{ cardId: "EB04-048", rested: true }],
        life: ["OP12-013", "OP12-017"],
        activeDon: 5,
      },
    );
    const defenderId = engine.findCardInZone("north", "character", "EB04-048");

    engine.playCard("EB01-003");
    const attackerId = engine.findCardInZone("south", "character", "EB01-003");
    engine.asSouth().attack(attackerId, defenderId);

    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(
      defenderId,
    );
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      attackerId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with the opponent above 2 Life the unboosted 5000 attacker cannot hurt a 6000 Leader", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB01-003"], activeDon: 4 },
      { leaderCardId: "OP11-040", activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard("EB01-003");
    const attackerId = engine.findCardInZone("south", "character", "EB01-003");
    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
