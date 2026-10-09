import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST07-010", () => {
  test.each([0, 1])("opponent chooses branch %s with original controller ownership", (branch) => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST07-010"], activeDon: 7, life: 2, deck: ["ST07-002", "ST07-006"] },
      { life: ["ST07-012", "ST07-014"] },
    );
    const ownTop = e.findCardInZone("south", "deck", "ST07-002");
    const opposingTop = e.findCardInZone("north", "life", "ST07-012");
    e.asSouth().play("ST07-010");
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
      { hand: ["ST07-010"], activeDon: 7, life: 2, deck: 10 },
      { life: 0 },
    );
    e.asSouth().play("ST07-010");
    e.resolveDecision("effectActionChoice", { optionId: "0" }, "north");
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(10);
    expect(e.getView("north").players.north.lifeCount).toBe(0);
    expect(e.getView("south").status).not.toBe("finished");
  });
});
