import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST12-011 Sanji", () => {
  test("power persists after hand grows beyond five and expires at own next turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-011", attachedDon: 1, playedOnTurn: 0 }], hand: 5 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST12-011");
    e.asSouth().attack(id, e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.endTurn("south");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("south").players.south.handCount).toBe(6);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.endTurn("north");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(3000);
  });
  test.each([
    { hand: 6, don: 1, power: 4000 },
    { hand: 5, don: 0, power: 3000 },
  ])("does not grant power beyond hand or DON gate: %s", ({ hand, don, power }) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-011", attachedDon: don, playedOnTurn: 0 }], hand },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-011"), e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(power);
    expect(e.getView("south").players.south.handCount).toBe(hand);
  });

  test("FAQ repeat attack stacks a second power grant", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST12-001",
        character: [{ cardId: "ST12-011", playedOnTurn: 0, attachedDon: 1 }, "ST12-015"],
        hand: 4,
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST12-011"),
      paid = e.findCardInZone("south", "character", "ST12-015");
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(id, e.leader("north"));
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnCharacter", { selectedIds: [paid] }, "south");
    e.asSouth().chooseTargets(id);
    // No usable Counter remains, so the Counter Step ends automatically.
    e.asSouth().attack(id, e.leader("north"));
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
});
