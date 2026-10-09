import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-016-yamato", () => {
  test("OnPlay moves one Life to decktop, preserves remaining face states and Rush attacks", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST13-016"],
        activeDon: 6,
        life: [
          { cardId: "ST02-002", faceUp: true, publicKnowledge: true },
          { cardId: "ST02-012", faceUp: true, publicKnowledge: true },
          "ST02-006",
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const [moved, up, down] = e.getState().players.south.life;
    e.playCard("ST13-016", "south");
    e.resolveDecision("effectRearrangeLifeOrder", { selectedIds: [moved!, down!, up!] }, "south");
    expect(e.getState().players.south.deck[0]).toBe(moved);
    expect(e.getState().cards[moved!]!.faceUp).toBe(false);
    expect(e.getState().players.south.life).toEqual([down, up]);
    expect(e.getState().cards[up!]!.faceUp).toBe(true);
    expect(e.getState().cards[down!]!.faceUp).toBe(false);
    const yamato = e.findCardInZone("south", "character", "ST13-016");
    e.attachDon(yamato, 1, "south");
    e.declareAttack(yamato, e.leader("north"), "south");
    expect(e.getView("south").players.north.lifeCount).toBe(3);
  });
  test("zero Life needs no ordering choice and still has Rush", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST13-016"], activeDon: 5, life: 0 },
      { character: [{ cardId: "ST02-012", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST13-016", "south");
    expect(e.getView("south").prompts).toHaveLength(0);
    e.declareAttack(
      e.findCardInZone("south", "character", "ST13-016"),
      e.findCardInZone("north", "character", "ST02-012"),
      "south",
    );
    expect(e.getView("south").players.north.trash.map((c) => c.cardId)).toContain("ST02-012");
  });
});
