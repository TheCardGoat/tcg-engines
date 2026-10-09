import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st09KouzukiOden005, prb01Kaido003 } from "@tcg/op-cards";
describe("ST09-005 Kouzuki Oden", () => {
  test.each([0, 1])("attached DON %s controls Double Attack damage", (don) => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st09KouzukiOden005, playedOnTurn: 0 }], activeDon: don },
      { life: 4 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const oden = e.findCardInZone("south", "character", "ST09-005");
    if (don) e.asSouth().attachDon(oden, 1);
    e.asSouth().attack(oden, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(don ? 2 : 3);
    expect(e.getView("north").players.north.hand).toHaveLength(don ? 2 : 1);
  });
  test("battle KO pays two hand cards before adding top deck to Life", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st09KouzukiOden005, rested: true }],
        hand: ["ST09-003", "ST09-006", "ST09-011"],
        deck: ["ST09-013", "ST09-003"],
        life: 2,
      },
      { character: [{ card: prb01Kaido003, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const paid = [
      e.findCardInZone("south", "hand", "ST09-003"),
      e.findCardInZone("south", "hand", "ST09-006"),
    ];
    const added = e.findCardInZone("south", "deck", "ST09-013");
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST04-003"),
      e.findCardInZone("south", "character", "ST09-005"),
    );
    e.asSouth().chooseCounter();
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: paid }, "south");
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining(paid),
    );
    expect(e.getView("judge").players.south.life[0]?.instanceId).toBe(added);
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").players.south.lifeCount).toBe(3);
  });
  test("declines On KO hand cost without adding Life", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st09KouzukiOden005, rested: true }],
        hand: ["ST09-003", "ST09-006"],
        life: 2,
      },
      { character: [{ card: prb01Kaido003, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST04-003"),
      e.findCardInZone("south", "character", "ST09-005"),
    );
    e.asSouth().chooseCounter();
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand).toHaveLength(2);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.trash).toHaveLength(1);
  });
});
