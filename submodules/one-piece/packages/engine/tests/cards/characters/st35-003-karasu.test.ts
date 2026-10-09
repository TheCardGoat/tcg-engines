import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st35-003-karasu", () => {
  test("trashes top2 then opponent chooses hand discard at seven cards", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "ST35-003", playedOnTurn: 0 }],
        deck: ["ST21-005", "ST21-006", "ST21-008"],
      },
      { hand: Array(7).fill("ST21-013") },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST35-003"), e.leader("north"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual([
      "ST21-005",
      "ST21-006",
    ]);
    e.asNorth().trashFromHand(e.findCardInZone("north", "hand", "ST21-013"));
    expect(e.getView("north").players.north.handCount).toBe(6);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("opponent six cards still allows paying top2 but gives no discard", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "ST35-003", playedOnTurn: 0 }],
        deck: ["ST21-005", "ST21-006", "ST21-008"],
      },
      { hand: Array(6).fill("ST21-013") },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST35-003"), e.leader("north"));
    e.asSouth().acceptOptional();
    expect(e.getView("north").players.north.handCount).toBe(6);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("declines optional top-deck trash with sufficient deck and opponent hand", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST35-003", playedOnTurn: 0 }], deck: 3 },
      { hand: Array(7).fill("ST21-013") },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST35-003"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.deckCount).toBe(3);
    expect(e.getView("north").players.north.handCount).toBe(7);
  });
  test("one deck card cannot partly pay top2", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST35-003", playedOnTurn: 0 }], deck: ["ST21-005"] },
      { hand: Array(7).fill("ST21-013") },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST35-003"), e.leader("north"));
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
    expect(e.getView("north").players.north.handCount).toBe(7);
  });
  test("paying the final two deck cards loses before opponent discards", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST35-003", playedOnTurn: 0 }], deck: ["ST21-005", "ST21-006"] },
      { hand: Array(7).fill("ST21-013") },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST35-003"), e.leader("north"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").status).toBe("finished");
    expect(e.getView("north").players.north.handCount).toBe(7);
    expect(e.getView("south").players.south.trash).toHaveLength(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
