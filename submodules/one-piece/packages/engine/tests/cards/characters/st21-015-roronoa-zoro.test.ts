import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-015 Roronoa Zoro", () => {
  test("two attached DON grant Rush after paying to play", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST21-015"], activeDon: 6 }, {});
    e.playCard("ST21-015");
    const z = e.findCardInZone("south", "character", "ST21-015");
    e.asSouth().attachDon(z, 1);
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: z,
        targetId: e.leader("north"),
      }).reason,
    ).toBeTruthy();
    e.asSouth().attachDon(z, 1);
    e.asSouth().attack(z, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
  test("On KO without DON plays only red power 6000 or less excluding Zoro", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "ST21-015", rested: true }],
        hand: ["ST21-008", "ST21-015", "ST12-004", "ST15-002", "ST21-016"],
      },
      { character: [{ cardId: "ST21-014", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST21-014"),
      e.findCardInZone("south", "character", "ST21-015"),
    );
    e.asSouth().chooseCounter();
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("south", "hand", "ST21-008"),
    ]);
    e.asSouth().choosePlay(e.findCardInZone("south", "hand", "ST21-008"));
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST21-008");
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("declines optional On KO play with an eligible hand card", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-015", rested: true }], hand: ["ST21-008"] },
      { character: [{ cardId: "ST21-014", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST21-014"),
      e.findCardInZone("south", "character", "ST21-015"),
    );
    e.asSouth().chooseCounter();
    e.asSouth().choosePlay();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
  });
});
