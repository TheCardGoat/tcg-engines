import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st27-002-catarina-devon", () => {
  test("self-trash reduces cost without causing OnKO draw and expires", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-081", character: ["ST27-002"], deck: ["ST21-005", "ST21-006"] },
      { character: ["ST21-006"] },
    );
    e.activateEffect(e.findCardInZone("south", "character", "ST27-002"), "activateMain");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-006"));
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(2);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(2);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(3);
  });
  test("wrong Leader can pay self-trash but cannot reduce cost", () => {
    const e = OnePieceTestEngine.create({ character: ["ST27-002"] }, { character: ["ST21-006"] });
    e.activateEffect(e.findCardInZone("south", "character", "ST27-002"), "activateMain");
    e.asSouth().acceptOptional();
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(3);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST27-002");
  });
  test("declines optional self-trash with legal target", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-081", character: ["ST27-002"] },
      { character: ["ST21-006"] },
    );
    e.activateEffect(e.findCardInZone("south", "character", "ST27-002"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST27-002");
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(3);
  });
  test("actual battle KO draws one card", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST27-002", rested: true }], deck: ["ST21-005", "ST21-006"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.findCardInZone("south", "character", "ST27-002"));
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST21-005");
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST27-002");
  });
});
