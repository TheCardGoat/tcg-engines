// CR 2.2.0: 6.2 (on-play triggers), 6.7.2.3 (choices), 8.9.1 (Rush), 8.15.1 (Ward).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { trampQuickOnHisFeet as tramp } from "./122-tramp-quick-on-his-feet";
const weak = (strength: number) =>
  createMockCharacter({
    id: "tramp-weak-" + strength,
    name: "Weak " + strength,
    cost: 1,
    strength,
    willpower: 5,
  });
const one = weak(1),
  strong = weak(2);
const ward = createMockCharacter({
  id: "tramp-ward",
  name: "Ward",
  cost: 1,
  strength: 1,
  willpower: 5,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const evasive = createMockCharacter({
  id: "tramp-evasive",
  name: "Evasive",
  cost: 1,
  strength: 1,
  willpower: 5,
  abilities: [{ type: "keyword", keyword: "Evasive" }],
});
const item = createMockItem({ id: "tramp-item", name: "Item", cost: 0 });
const reducer = createMockCharacter({
  id: "tramp-reducer",
  name: "Reducer",
  cost: 0,
  abilities: [
    {
      type: "static",
      effect: { type: "modify-stat", stat: "strength", modifier: -2, target: "YOUR_CHARACTERS" },
    },
  ],
});
describe("Tramp - Quick on His Feet", () => {
  it.each([-1, 0, 1])("exerts chosen current strength %s", (strength: number) => {
    const target = weak(strength);
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tramp],
      play: [target],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(target)).toBe(true);
    expect(game.asPlayerOne().hasKeyword(tramp, "Rush")).toBe(false);
  });
  it("can exert opposing weak character and already-exerted character", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tramp], inkwell: 2 },
      { play: [{ card: one, exerted: true }] },
    );
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [one] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(one)).toBe(true);
  });
  it("can exert own Ward but rejects opposing Ward with retry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tramp], play: [ward], inkwell: 2 },
      { play: [ward] },
    );
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    const own = game.findCardInstanceId(ward, "play", PLAYER_ONE),
      enemy = game.findCardInstanceId(ward, "play", PLAYER_TWO);
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [enemy] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(enemy)).toBe(false);
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [own] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(own)).toBe(true);
  });
  it("uses modified strength and can exert self when reduced to zero", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tramp],
      play: [reducer],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(tramp)).toBe(0);
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [tramp] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(tramp)).toBe(true);
  });
  it("rejects strength two including normal Tramp; legal retry exerts one", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tramp],
      play: [one, strong],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    for (const target of [tramp, strong])
      expect(
        game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [target] }),
      ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [one] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(strong)).toBe(false);
  });
  it("rejects hand/discard/item/multiple targets with legal retry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tramp, one], discard: [strong], play: [item, weak(0)], inkwell: 2 },
      { play: [one] },
    );
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    const hidden = game.findCardInstanceId(one, "hand", PLAYER_ONE),
      enemy = game.findCardInstanceId(one, "play", PLAYER_TWO);
    for (const targets of [[hidden], [strong], [item], [enemy, weak(0)]])
      expect(
        game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets }),
      ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [enemy] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(enemy)).toBe(true);
  });
  it("exert mode does not allow drying Tramp to challenge or quest", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tramp], inkwell: 2 },
      { play: [one] },
    );
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [one] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().challenge(tramp, one)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(tramp)).not.toBeSuccessfulCommand();
  });
  it("can choose exert with no eligible target and resolve without granting Rush", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tramp], inkwell: 2 },
      { play: [strong] },
    );
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().hasKeyword(tramp, "Rush")).toBe(false);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
  it("Rush challenges immediately for two damage but does not allow questing", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tramp], inkwell: 2 },
      { play: [{ card: one, exerted: true }] },
    );
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(tramp)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().challenge(tramp, one)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(one)).toBe(2);
    expect(game.asPlayerOne().getDamage(tramp)).toBe(1);
    expect(game.asPlayerOne().isExerted(tramp)).toBe(true);
    expect(game.asPlayerOne().challenge(tramp, one)).not.toBeSuccessfulCommand();
  });
  it.each([{ card: one }, { card: evasive, exerted: true }])(
    "Rush does not bypass defender legality %j",
    (target: { card: typeof one; exerted?: boolean }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [tramp], inkwell: 2 },
        { play: [target] },
      );
      expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 1 }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().challenge(tramp, target.card)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().isExerted(tramp)).toBe(false);
    },
  );
  it("Rush expires on pass; next own turn quests one without new entry choice", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tramp], inkwell: 2, deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().hasKeyword(tramp, "Rush")).toBe(true);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().hasKeyword(tramp, "Rush")).toBe(false);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(tramp)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
  it("two copies choose independently and Rush affects only its source", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tramp, tramp], inkwell: 4 },
      { play: [one] },
    );
    const [first, second] = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(game.asPlayerOne().playCard(first)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(first, { choiceIndex: 0, targets: [one] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(second)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(second, { choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().hasKeyword(first, "Rush")).toBe(false);
    expect(game.asPlayerOne().hasKeyword(second, "Rush")).toBe(true);
    expect(game.asPlayerTwo().isExerted(one)).toBe(true);
  });
  it("checks derived strength one on a printed strength-three target", () => {
    const target = weak(3);
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tramp],
      play: [target, reducer],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(tramp)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(target)).toBe(1);
    expect(
      game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex: 0, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(target)).toBe(true);
  });
  it.each([0, 1])(
    "player two controls mode %s and preserves opposing resources",
    (choiceIndex: number) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [one], inkwell: 2, deck: 6 },
        { hand: [tramp], inkwell: 2, deck: 6 },
      );
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().playCard(tramp)).toBeSuccessfulCommand();
      const targets = choiceIndex === 0 ? [one] : undefined;
      expect(
        game.asPlayerOne().resolvePendingByCard(tramp, { choiceIndex, targets }),
      ).not.toBeSuccessfulCommand();
      expect(
        game.asPlayerTwo().resolvePendingByCard(tramp, { choiceIndex, targets }),
      ).toBeSuccessfulCommand();
      expect(game.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
      expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
      expect(game.asPlayerOne().isExerted(one)).toBe(choiceIndex === 0);
      expect(game.asPlayerTwo().hasKeyword(tramp, "Rush")).toBe(choiceIndex === 1);
      expect(game.asPlayerTwo().quest(tramp)).not.toBeSuccessfulCommand();
      expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().hasKeyword(tramp, "Rush")).toBe(false);
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().quest(tramp)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_TWO)).toBe(1);
      expect(game.getLore(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    },
  );
  it("one ink cannot play or create a choice; Tramp can be inked", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [tramp], inkwell: 1 });
    expect(game.asPlayerOne().playCard(tramp)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(tramp)).toBe("hand");
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerOne().putIntoInkwell(PLAYER_ONE, tramp)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(tramp)).toBe("inkwell");
  });
});
