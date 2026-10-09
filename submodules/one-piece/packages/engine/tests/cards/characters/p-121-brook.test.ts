import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-121 Brook", () => {
  test("mills three on play, then the opponent chooses two discards after battle KO", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["P-121"],
        activeDon: 4,
        deck: ["ST02-002", "ST02-006", "ST02-012", "EB01-005", "EB01-005", "EB01-005", "EB01-005"],
      },
      {
        hand: ["ST02-002", "ST02-006", "ST02-012"],
        character: [{ cardId: "EB01-018", playedOnTurn: 0 }],
      },
    );
    e.asSouth().play("P-121");
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual([
      "ST02-002",
      "ST02-006",
      "ST02-012",
    ]);
    const brook = e.findCardInZone("south", "character", "P-121");
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    e.asSouth().attack(brook, e.leader("north"));
    e.asNorth().chooseCounter();
    e.asSouth().endTurn();
    e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), brook);
    e.asSouth().chooseCounter();
    const p = e.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    if (p?.kind !== "selectEntity") throw Error("discard");
    const ids = p.candidates.slice(0, 2).map((c) => c.ref.id);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: ids }, "north");
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining(ids),
    );
  });
  test("partial opponent hand is still trashed", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-121", rested: true }] },
      { hand: ["ST02-002"], character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hand = e.findCardInZone("north", "hand", "ST02-002");
    e.asNorth().attack(
      e.findCardInZone("north", "character", "EB01-018"),
      e.findCardInZone("south", "character", "P-121"),
    );
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(hand);
    expect(e.getView("north").players.north.hand).toHaveLength(0);
  });
});
