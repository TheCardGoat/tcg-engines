import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST09-007 Shinobu", () => {
  test("blocks then takes bottom Life to survive with battle-only power", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST09-007"], life: ["ST09-003", "ST09-006"] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "character", "ST09-007");
    const paid = e.findCardInZone("south", "life", "ST09-006");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(card);
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(card);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(2000);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(paid);
  });
  test("declines On Block Life cost and loses the battle without Leader damage", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST09-007"], life: 2 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "character", "ST09-007");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(card);
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(card);
  });
});
