import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-139 Nami", () => {
  test("gives rested DON on play and draws when attacking with DON", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-139"],
      activeDon: 5,
      deck: ["ST02-002", "ST02-006", "ST02-012", "EB01-005"],
    });
    e.asSouth().play("P-139");
    const nami = e.findCardInZone("south", "character", "P-139");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [nami] }, "south");
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(1);
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    e.asSouth().attachDon(nami, 1);
    const before = e.getView("south").players.south.hand.length;
    e.asSouth().attack(nami, e.leader("north"));
    expect(e.getView("south").players.south.hand).toHaveLength(before + 1);
  });
  test("without DON an attack does not draw", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-139", playedOnTurn: 0 }], deck: ["ST02-002", "EB01-005"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "P-139"), e.leader("north"));
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(2);
  });
});
