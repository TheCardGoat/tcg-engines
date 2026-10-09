import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st27-001-avalo-pizarro", () => {
  test("rests named Fullalead for +4000 and spends once per turn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP09-081",
        character: ["ST27-001"],
        stage: "OP09-099",
        hand: ["OP09-099"],
        activeDon: 1,
      },
      {},
    );
    const a = e.findCardInZone("south", "character", "ST27-001");
    e.activateEffect(a, "activateMain");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    const replacement = e.findCardInZone("south", "hand", "OP09-099");
    e.playCard("OP09-099");
    expect(e.getView("south").players.south.stage?.instanceId).toBe(replacement);
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: a,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(1000);
  });
  test("wrong Leader can pay Fullalead but receives no power", () => {
    const e = OnePieceTestEngine.create({ character: ["ST27-001"], stage: "OP09-099" });
    e.activateEffect(e.findCardInZone("south", "character", "ST27-001"), "activateMain");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(1000);
  });
  test("declines optional Fullalead rest", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP09-081",
      character: ["ST27-001"],
      stage: "OP09-099",
    });
    e.activateEffect(e.findCardInZone("south", "character", "ST27-001"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(1000);
  });
  test("battle KO independently draws one card", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST27-001", rested: true }], deck: ["ST21-005", "ST21-006"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.findCardInZone("south", "character", "ST27-001"));
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST21-005");
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST27-001");
  });
  test("an unrelated active Stage cannot pay the named Fullalead cost", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP09-081",
      character: ["ST27-001"],
      stage: "ST04-017",
    });
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.findCardInZone("south", "character", "ST27-001"),
        trigger: "activateMain",
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(1000);
  });
});
