import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST25-001 Alvida", () => {
  test("Buggy OnPlay draws three before choosing two discards", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP09-042",
      hand: ["ST25-001"],
      activeDon: 4,
      deck: ["ST02-002", "ST02-006", "ST02-012", "ST01-006"],
    });
    const a = e.findCardInZone("south", "deck", "ST02-002"),
      b = e.findCardInZone("south", "deck", "ST02-012");
    e.asSouth().play("ST25-001");
    expect(e.getView("south").players.south.handCount).toBe(3);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [a, b] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-006"]);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual([a, b]);
  });
  test("wrong Leader does not draw or discard", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST25-001"], activeDon: 4, deck: 10 });
    e.asSouth().play("ST25-001");
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
  test("two base-cost-five Characters grant cost then losing one removes it", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST25-001", "ST22-010", "ST22-010"],
      hand: ["OP04-056"],
      activeDon: 6,
    });
    const a = e.findCardInZone("south", "character", "ST25-001");
    expect(e.getView("south").players.south.characters.find((c) => c?.instanceId === a)?.cost).toBe(
      5,
    );
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(e.findCardInZone("south", "character", "ST22-010"));
    expect(e.getView("south").players.south.characters.find((c) => c?.instanceId === a)?.cost).toBe(
      4,
    );
  });
  test("current cost raised to five does not satisfy base-cost gate", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST14-001",
      character: ["ST25-001", "ST25-002", "ST25-005"],
      activeDon: 1,
    });
    e.asSouth().attachDon(e.leader("south"), 1);
    expect(
      e
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((c) => c!.cost),
    ).toEqual([5, 5, 5]);
  });
  test("reduced current cost does not erase a qualifying base cost", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST25-001", "ST22-010", "ST22-010"] },
      { hand: ["OP02-117"], activeDon: 1 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().play("OP02-117");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST22-010"));
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(5);
  });
});
