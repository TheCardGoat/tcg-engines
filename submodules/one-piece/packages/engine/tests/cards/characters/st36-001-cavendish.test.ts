import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st36-001-cavendish", () => {
  test("battle KO pays a chosen hand card and adds top deck to top Life", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "ST36-001", rested: true }],
        hand: ["ST21-005", "ST21-006"],
        deck: ["ST21-008", "ST21-013"],
      },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    const top = e.findCardInZone("south", "deck", "ST21-008");
    e.asNorth().attack(e.leader("north"), e.findCardInZone("south", "character", "ST36-001"));
    e.asSouth().chooseCounter();
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("south", "hand", "ST21-005")] },
      "south",
    );
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(5);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    /* Top Life identity is hidden in the public view. */ expect(
      e.getState().players.south.life[0],
    ).toBe(top);
  });
  test("declines optional hand payment after KO", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST36-001", rested: true }], hand: ["ST21-005"], deck: 3 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.findCardInZone("south", "character", "ST36-001"));
    e.asSouth().chooseCounter();
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("zero cards added still leaves the hand payment spent", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST36-001", rested: true }], hand: ["ST21-005"], deck: 3 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.findCardInZone("south", "character", "ST36-001"));
    e.asSouth().chooseCounter();
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
});
