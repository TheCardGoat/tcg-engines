// CR 2.2.0: 6.4.1 (continuous bonus), 8.10.1–8.10.7 (Shift payment and inherited state).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { pepitaImeldasRightHand as pepita } from "./119-pepita-imeldas-right-hand";
import { pepitaWatchfulAlebrije as base } from "./040-pepita-watchful-alebrije";
const filler = createMockCharacter({ id: "wisdom-filler", name: "Filler", cost: 1 });
const wrong = createMockCharacter({ id: "wisdom-wrong", name: "Wrong Name", cost: 1 });
const defender = createMockCharacter({
  id: "wisdom-defender",
  name: "Defender",
  cost: 1,
  strength: 1,
  willpower: 20,
});
const grow = createMockAction({ id: "wisdom-grow", name: "Grow", cost: 0 });
const shrink = createMockAction({
  id: "wisdom-shrink",
  name: "Shrink",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: { upTo: 2 },
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});
describe("Pepita - Imelda's Right Hand", () => {
  it.each([0, 9, 10, 11])("quests with the printed bonus at discard count %s", (count: number) => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ play: [pepita], discard: count });
    expect(game.asPlayerOne().getCardStrength(pepita)).toBe(count >= 10 ? 6 : 4);
    expect(game.asPlayerOne().quest(pepita)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(count >= 10 ? 3 : 1);
  });
  it.each([9, 10])("deals actual combat damage at discard count %s", (count: number) => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [pepita], discard: count },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(game.asPlayerOne().challenge(pepita, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toHaveDamage({ card: defender, value: count >= 10 ? 6 : 4 });
    expect(game.asPlayerOne()).toHaveDamage({ card: pepita, value: 1 });
  });
  it("opposing discard does not count", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [pepita], discard: 9 },
      { discard: 12 },
    );
    expect(game.asPlayerOne().getCardStrength(pepita)).toBe(4);
    expect(game.asPlayerOne().quest(pepita)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
  });
  it("the tenth card activates both bonuses and returning two cards ends them", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [pepita], hand: [grow, shrink], discard: Array(9).fill(filler), deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(grow)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(10);
    expect(game.asPlayerOne().getCardStrength(pepita)).toBe(6);
    expect(game.asPlayerOne().quest(pepita)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    const targets = game.getCardInstanceIdsInZone("discard", PLAYER_ONE).slice(0, 2);
    expect(game.asPlayerOne().playCard(shrink, { targets })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(9);
    expect(game.asPlayerOne().getCardStrength(pepita)).toBe(4);
    expect(game.asPlayerOne().quest(pepita)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(4);
  });
  it("each own copy gets the bonus while the opposing copy uses its own count", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [pepita, pepita], discard: 10 },
      { play: [pepita], discard: 9 },
    );
    for (const id of game.getCardInstanceIdsInZone("play", PLAYER_ONE))
      expect(game.asPlayerOne().quest(id)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(6);
    const enemy = game.findCardInstanceId(pepita, "play", PLAYER_TWO);
    expect(game.asPlayerTwo().getCardStrength(enemy)).toBe(4);
    expect(game.asPlayerTwo().getCardLore(enemy)).toBe(1);
  });
  it("Shift pays three, retains a dry base, and immediately quests with the bonus", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [base],
      hand: [pepita],
      inkwell: 3,
      discard: 10,
    });
    const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
    expect(
      game.asPlayerOne().playCard(pepita, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.getCardsUnder(pepita)).toEqual([shiftTarget]);
    expect(game.asPlayerOne().quest(pepita)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(3);
  });
  it("Shift retains damage and exertion", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: base, exerted: true, damage: 2 }],
      hand: [pepita],
      inkwell: 3,
    });
    const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
    expect(
      game.asPlayerOne().playCard(pepita, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(pepita)).toBe(true);
    expect(game.asPlayerOne()).toHaveDamage({ card: pepita, value: 2 });
    expect(game.asPlayerOne().quest(pepita)).not.toBeSuccessfulCommand();
  });
  it("Shift onto a freshly played base retains drying", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [base, pepita],
      inkwell: base.cost + 3,
    });
    expect(game.asPlayerOne().playCard(base)).toBeSuccessfulCommand();
    const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
    expect(
      game.asPlayerOne().playCard(pepita, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(pepita)).not.toBeSuccessfulCommand();
  });
  it("rejects wrong name, opposing base, and a base in hand without payment before retry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [base, wrong], hand: [pepita, base], inkwell: 3 },
      { play: [base] },
    );
    const valid = game.findCardInstanceId(base, "play", PLAYER_ONE);
    for (const shiftTarget of [
      game.findCardInstanceId(wrong, "play", PLAYER_ONE),
      game.findCardInstanceId(base, "play", PLAYER_TWO),
      game.findCardInstanceId(base, "hand", PLAYER_ONE),
    ]) {
      expect(
        game.asPlayerOne().playCard(pepita, { cost: { cost: "shift", shiftTarget } }),
      ).not.toBeSuccessfulCommand();
      expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
    }
    expect(
      game.asPlayerOne().playCard(pepita, { cost: { cost: "shift", shiftTarget: valid } }),
    ).toBeSuccessfulCommand();
  });
  it("rejects Shift at two ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [base],
      hand: [pepita],
      inkwell: 2,
    });
    const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
    expect(
      game.asPlayerOne().playCard(pepita, { cost: { cost: "shift", shiftTarget } }),
    ).not.toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().getCardZone(pepita)).toBe("hand");
  });
  it("normal play pays five and remains drying", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pepita],
      inkwell: 5,
      discard: 10,
    });
    expect(game.asPlayerOne().playCard(pepita)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getCardStrength(pepita)).toBe(6);
    expect(game.asPlayerOne().quest(pepita)).not.toBeSuccessfulCommand();
  });
  it("banishing the shifted character puts both cards in discard", () => {
    const banish = createMockAction({
      id: "wisdom-banish",
      name: "Banish",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [base],
      hand: [pepita, banish],
      inkwell: 3,
    });
    const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
    expect(
      game.asPlayerOne().playCard(pepita, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(banish, { targets: [pepita] })).toBeSuccessfulCommand();
    expect(game.asServer().getCardZone(pepita)).toBe("discard");
    expect(game.asServer().getCardZone(shiftTarget)).toBe("discard");
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(3);
  });
  it("player two shifts its own base and uses only its own discard threshold", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [base], discard: 12, inkwell: 3, lore: 4, deck: 6 },
      { play: [base], hand: [pepita, grow], discard: 9, inkwell: 3, lore: 7, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const own = game.findCardInstanceId(base, "play", PLAYER_TWO);
    const enemy = game.findCardInstanceId(base, "play", PLAYER_ONE);
    expect(
      game.asPlayerTwo().playCard(pepita, { cost: { cost: "shift", shiftTarget: enemy } }),
    ).not.toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_TWO)).toBe(3);
    expect(
      game.asPlayerTwo().playCard(pepita, { cost: { cost: "shift", shiftTarget: own } }),
    ).toBeSuccessfulCommand();
    expect(game.getCardsUnder(pepita)).toEqual([own]);
    expect(game.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerTwo().getCardStrength(pepita)).toBe(4);
    expect(game.asPlayerTwo().getCardLore(pepita)).toBe(1);
    expect(game.asPlayerTwo().playCard(grow)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(10);
    expect(game.asPlayerTwo().getCardStrength(pepita)).toBe(6);
    expect(game.asPlayerTwo().quest(pepita)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(10);
    expect(game.getLore(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerOne().getCardZone(enemy)).toBe("play");
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it("normal play cannot use four ink as a partial payment", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [pepita], inkwell: 4 });
    expect(game.asPlayerOne().playCard(pepita)).not.toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerOne().getCardZone(pepita)).toBe("hand");
  });
});
