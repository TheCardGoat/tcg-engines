import { describe, expect, test } from "vite-plus/test";
import { eb04RobLucci048, eb01Doma005, op07RobLucci079 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-048 Rob Lucci", () => {
  test.each([4, 5, 10])(
    "scales power and cost with complete groups in a %i-card trash",
    (trash) => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: op07RobLucci079,
        hand: [eb04RobLucci048],
        activeDon: 4,
        trash,
      });
      engine.playCard(eb04RobLucci048);
      engine.resolveDecision("effectOptional", { optionId: "no" });
      const lucci = engine
        .getView("south")
        .players.south.characters.find((card) => card?.cardId === eb04RobLucci048.id);
      expect(lucci?.power).toBe(6000 + Math.floor(trash / 5) * 1000);
      expect(lucci?.cost).toBe(4 + Math.floor(trash / 5) * 2);
      expect(engine.getView("south").players.south.restedDon).toBe(4);
    },
  );

  test("trashes a chosen friendly Character before drawing and updates its continuous stats", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07RobLucci079,
      hand: [eb04RobLucci048],
      character: [eb01Doma005],
      activeDon: 4,
      trash: 4,
    });
    const doma = engine.findCardInZone("south", "character", eb01Doma005);
    const deck = engine.getView("south").players.south.deckCount;
    engine.playCard(eb04RobLucci048);
    engine.resolveDecision("effectOptional", { optionId: "yes" });
    engine.resolveDecision("effectCostTrashCharacter", { selectedIds: [doma] });
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(doma);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.deckCount).toBe(deck - 1);
    const lucci = view.players.south.characters.find((card) => card?.cardId === eb04RobLucci048.id);
    expect(lucci?.power).toBe(7000);
    expect(lucci?.cost).toBe(6);
    expect(view.prompts).toHaveLength(0);
  });

  test("a non-CP Leader does not grant stats; Lucci may pay by trashing itself", () => {
    const engine = OnePieceTestEngine.create({ hand: [eb04RobLucci048], activeDon: 4, trash: 10 });
    engine.playCard(eb04RobLucci048);
    const lucci = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === eb04RobLucci048.id);
    expect(lucci?.power).toBe(6000);
    expect(lucci?.cost).toBe(4);
    engine.resolveDecision("effectOptional", { optionId: "yes" });
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(
      engine
        .getView("south")
        .players.south.trash.some((card) => card.cardId === eb04RobLucci048.id),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("declining On Play preserves the Character and does not draw", () => {
    const engine = OnePieceTestEngine.create({ hand: [eb04RobLucci048], activeDon: 4, trash: 5 });
    const before = engine.getView("south").players.south;
    engine.playCard(eb04RobLucci048);
    engine.resolveDecision("effectOptional", { optionId: "no" });
    const after = engine.getView("south").players.south;
    expect(after.hand).toHaveLength(0);
    expect(after.deckCount).toBe(before.deckCount);
    expect(after.trash).toEqual(before.trash);
    expect(after.characters.some((card) => card?.cardId === eb04RobLucci048.id)).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
