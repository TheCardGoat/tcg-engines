import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-003", () => {
  test("[Rush] can attack Characters on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-003"], activeDon: 8 },
      { character: [{ cardId: "OP13-013", rested: true }], activeDon: 5 },
    );

    engine.playCard("EB04-003");
    const selfId = engine.findCardInZone("south", "character", "EB04-003");
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    engine.asSouth().attack(selfId, higumaId);

    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(
      higumaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Opponent's Turn] makes a {Navy} Leader's base power 7000, shrugging off a 6000 attacker", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP05-041", character: ["EB04-003"], activeDon: 8 },
      { character: ["EB04-048"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("EB04-048", engine.asSouth().leader());

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
