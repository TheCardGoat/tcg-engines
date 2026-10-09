import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st07CharlotteDaifuku005 } from "@tcg/op-cards";
describe("ST07-005 Charlotte Daifuku", () => {
  test("pays top Life then adds the top deck card to Life", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st07CharlotteDaifuku005, playedOnTurn: 0 }],
        activeDon: 1,
        life: ["ST07-002", "ST07-006"],
        deck: ["ST07-014", "ST07-012"],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const daifuku = e.findCardInZone("south", "character", "ST07-005");
    const paid = e.findCardInZone("south", "life", "ST07-002");
    const added = e.findCardInZone("south", "deck", "ST07-014");
    e.asSouth().attachDon(daifuku, 1);
    e.asSouth().attack(daifuku, e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(paid);
    expect(e.getView("judge").players.south.life[0]?.instanceId).toBe(added);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("declines Life payment and does not move deck or Life", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st07CharlotteDaifuku005, playedOnTurn: 0 }],
        activeDon: 1,
        life: 2,
        deck: 10,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const card = e.findCardInZone("south", "character", "ST07-005");
    e.asSouth().attachDon(card, 1);
    e.asSouth().attack(card, e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(10);
    expect(e.getView("south").players.south.hand).toHaveLength(0);
  });
  test("without attached DON the attack does not offer or pay the Life cost", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st07CharlotteDaifuku005, playedOnTurn: 0 }], life: 2, deck: 10 },
      { life: ["ST07-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST07-005"), e.leader("north"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(10);
    expect(e.getView("north").players.north.hand).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
