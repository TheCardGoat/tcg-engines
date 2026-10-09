import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-103 Charlotte Katakuri", () => {
  test("FAQ: opponent-turn Life Trigger plays this card without its Your Turn On Play", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", life: ["OP17-103", "EB01-025"], deck: 5, activeDon: 2 },
      { hand: ["EB01-005"] },
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const view = e.getView("south");
    expect(view.players.south.characters.map((c) => c?.cardId)).toContain("OP17-103");
    expect(view.players.south.deckCount).toBe(5);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.north.handCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
  test.each([0, 1])(
    "on its controller's turn, adding %i Life still gives the selected Character minus3000",
    (amount) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "ST07-001",
          hand: ["OP17-103"],
          activeDon: 6,
          deck: ["ST02-002", "ST02-006", "OP13-013"],
        },
        { character: ["EB01-018"] },
      );
      const life = e.getView("south").players.south.lifeCount,
        target = e.findCardInZone("north", "character", "EB01-018");
      e.asSouth().play("OP17-103");
      e.resolveDecision("effectAddToLifeFromDeck", { optionId: String(amount) }, "south");
      e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      expect(e.getView("south").players.south.lifeCount).toBe(life + amount);
      expect(e.getView("south").players.south.deckCount).toBe(3 - amount);
      expect(e.getView("south").players.north.characters[0]?.power).toBe(4000);
      e.endTurn("south");
      expect(e.getView("south").players.north.characters[0]?.power).toBe(7000);
    },
  );
  test("a non-Big-Mom Leader suppresses both Life addition and the following power reduction", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST13-003",
        hand: ["OP17-103"],
        activeDon: 6,
        deck: ["ST13-012", "ST13-013"],
      },
      { leaderCardId: "ST02-001", character: ["EB01-018"] },
    );
    const before = e.getView("south").players.south;
    e.asSouth().play("OP17-103");
    const view = e.getView("south");
    expect(view.players.south.lifeCount).toBe(before.lifeCount);
    expect(view.players.south.deckCount).toBe(before.deckCount);
    expect(view.players.north.characters[0]?.power).toBe(7000);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(6);
    expect(view.prompts).toHaveLength(0);
  });
});
