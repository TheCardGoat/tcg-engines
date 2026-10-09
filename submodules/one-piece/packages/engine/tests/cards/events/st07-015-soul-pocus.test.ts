import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST07-015", () => {
  test.each([0, 1])("opponent chooses branch %s with original controller ownership", (branch) => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST07-015"], activeDon: 5, life: 2, deck: ["ST07-002", "ST07-006"] },
      { life: ["ST07-012", "ST07-014"] },
    );
    const ownTop = e.findCardInZone("south", "deck", "ST07-002");
    const opposingTop = e.findCardInZone("north", "life", "ST07-012");
    e.asSouth().play("ST07-015");
    expect(e.pendingDecision("effectActionChoice", "north").actorId).toBe("north");
    e.resolveDecision("effectActionChoice", { optionId: String(branch) }, "north");
    expect(e.getView("south").players.south.lifeCount).toBe(branch === 0 ? 2 : 3);
    expect(e.getView("north").players.north.lifeCount).toBe(branch === 0 ? 1 : 2);
    if (branch === 0)
      expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(
        opposingTop,
      );
    else expect(e.getView("judge").players.south.life[0]?.instanceId).toBe(ownTop);
  });
  test("opponent with zero Life may choose trash and do nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST07-015"], activeDon: 5, life: 2, deck: 10 },
      { life: 0 },
    );
    e.asSouth().play("ST07-015");
    e.resolveDecision("effectActionChoice", { optionId: "0" }, "north");
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(10);
    expect(e.getView("north").players.north.lifeCount).toBe(0);
    expect(e.getView("south").status).not.toBe("finished");
  });
  test("Life Trigger replenishes Life before the second Double Attack damage", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST07-015"], deck: ["ST07-002", "ST07-006"] },
      { leaderCardId: "ST07-001", character: ["ST07-013"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const added = e.findCardInZone("south", "deck", "ST07-002");
    e.asNorth().activateMain(e.findCardInZone("north", "character", "ST07-013"));
    e.asNorth().acceptOptional();
    e.asNorth().chooseTargets(e.leader("north"));
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.resolveDecision("effectActionChoice", { optionId: "1" }, "north");
    expect(e.getView("south").players.south.lifeCount).toBe(0);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(added);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").status).not.toBe("finished");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
