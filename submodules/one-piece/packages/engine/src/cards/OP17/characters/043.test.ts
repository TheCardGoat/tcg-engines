import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-043 Ganzui", () => {
  test("FAQ: highest concurrent base-power setter takes priority", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP17-001",
      character: [{ cardId: "EB04-004", playedOnTurn: 0 }],
      hand: ["OP17-043"],
      activeDon: 8,
    });
    e.declareAttack(e.findCardInZone("south", "character", "EB04-004"), e.leader("north"), "south");
    expect(e.getView("south").players.south.leader?.power).toBe(7000);
    e.playCard("OP17-043");
    expect(e.getView("south").players.south.leader?.power).toBe(7000);
    e.endTurn("south");
    expect(e.getView("south").players.south.leader?.power).toBe(7000);
    e.endTurn("north");
    expect(e.getView("south").players.south.leader?.power).toBe(5000);
  });

  test("does not offer the replacement when fewer than two hand cards can be paid", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-043", rested: true }], hand: ["EB01-005"] },
      { character: [{ cardId: "OP16-096", playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const ganzui = engine.findCardInZone("south", "character", "OP17-043");
    engine.declareAttack(engine.findCardInZone("north", "character", "OP16-096"), ganzui, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(ganzui);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });
  test("On Play sets the Leader base power until the opponent next turn ends", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP17-043"], activeDon: 6 }, {});
    engine.playCard("OP17-043");
    engine.attachDon(engine.leader("south"), 1);
    expect(engine.getView("south").players.south.leader?.power).toBe(7000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader?.power).toBe(6000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader?.power).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each(["yes", "no"])(
    "battle replacement pays exactly two hand cards or declines: %s",
    (answer) => {
      const engine = OnePieceTestEngine.create(
        {
          character: [{ cardId: "OP17-043", rested: true }],
          hand: ["EB01-005", "EB01-025", "OP15-107"],
        },
        { character: [{ cardId: "OP16-096", playedOnTurn: 0 }] },
        { activeSeat: "north" },
      );
      const ganzui = engine.findCardInZone("south", "character", "OP17-043");
      const payment = [
        engine.findCardInZone("south", "hand", "EB01-005"),
        engine.findCardInZone("south", "hand", "EB01-025"),
      ];
      engine.declareAttack(
        engine.findCardInZone("north", "character", "OP16-096"),
        ganzui,
        "north",
      );
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
      engine.resolveDecision("battleKoReplacement", { optionId: answer }, "south");
      if (answer === "yes") {
        engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: payment }, "south");
      }
      const view = engine.getView("south");
      expect(view.players.south.characters.some((card) => card?.instanceId === ganzui)).toBe(
        answer === "yes",
      );
      expect(view.players.south.hand).toHaveLength(answer === "yes" ? 1 : 3);
      expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
        answer === "yes" ? payment : [ganzui],
      );
      expect(view.prompts).toHaveLength(0);
    },
  );
});
