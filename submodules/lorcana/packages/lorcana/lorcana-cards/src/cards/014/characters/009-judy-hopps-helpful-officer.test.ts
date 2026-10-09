// CR 2.2.0: 6.7.2.3 resolution choices and doing as much as possible; 8.15.1 Ward.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { judyHoppsHelpfulOfficer } from "./009-judy-hopps-helpful-officer";

const damagedCharacter = createMockCharacter({
  id: "judy-ho-damaged-target",
  name: "Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Judy Hopps - Helpful Officer", () => {
  it("removes up to 2 damage from chosen character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [judyHoppsHelpfulOfficer],
      inkwell: judyHoppsHelpfulOfficer.cost,
      play: [{ card: damagedCharacter, damage: 3 }],
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(judyHoppsHelpfulOfficer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(judyHoppsHelpfulOfficer, {
        targets: [damagedCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(1);
  });

  it("resolves cleanly with no damaged character to heal", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [judyHoppsHelpfulOfficer],
      inkwell: judyHoppsHelpfulOfficer.cost,
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(judyHoppsHelpfulOfficer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(judyHoppsHelpfulOfficer)).toBe("play");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(judyHoppsHelpfulOfficer, {
        targets: [judyHoppsHelpfulOfficer],
        amount: 0,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(judyHoppsHelpfulOfficer)).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it.each([0, 1, 2])(
    "allows choosing to remove %i damage from an opposing character",
    (amount: number) => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [judyHoppsHelpfulOfficer], inkwell: 1, deck: 3 },
        { play: [{ card: damagedCharacter, damage: 3 }], deck: 3 },
      );
      expect(engine.asPlayerOne().playCard(judyHoppsHelpfulOfficer)).toBeSuccessfulCommand();
      expect(
        engine.asPlayerOne().resolvePendingByCard(judyHoppsHelpfulOfficer, {
          targets: [damagedCharacter],
          amount,
        }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerTwo().getDamage(damagedCharacter)).toBe(3 - amount);
      expect(engine.asPlayerOne().getBagCount()).toBe(0);
      expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    },
  );

  it("removes only existing damage when fewer than two damage are present", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [judyHoppsHelpfulOfficer],
      inkwell: 1,
      play: [{ card: damagedCharacter, damage: 1 }],
      deck: 3,
    });
    expect(engine.asPlayerOne().playCard(judyHoppsHelpfulOfficer)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(judyHoppsHelpfulOfficer, {
        targets: [damagedCharacter],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(damagedCharacter)).toBe(0);
  });

  it("heals an opposing target when Judy is played by Player Two", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: damagedCharacter, damage: 3 }], deck: 6 },
      { hand: [judyHoppsHelpfulOfficer], inkwell: 1, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(judyHoppsHelpfulOfficer)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(judyHoppsHelpfulOfficer, { targets: [damagedCharacter], amount: 2 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(damagedCharacter)).toBe(1);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
});

it("Player Two exact copies heal opposing and own damage then complete an undamaged-only board", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: damagedCharacter, damage: 2 }], deck: 6 },
    {
      hand: [judyHoppsHelpfulOfficer, judyHoppsHelpfulOfficer, judyHoppsHelpfulOfficer],
      play: [{ card: damagedCharacter, damage: 1 }],
      inkwell: 3,
      deck: 6,
    },
  );
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_TWO);
  const enemy = game.findCardInstanceId(damagedCharacter, "play", PLAYER_ONE);
  const own = game.findCardInstanceId(damagedCharacter, "play", PLAYER_TWO);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(copies[0])).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(copies[0], { targets: [enemy], amount: 2 }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(1);
  expect(game.asPlayerOne().getDamage(enemy)).toBe(2);
  expect(
    game.asPlayerTwo().resolvePendingByCard(copies[0], { targets: [enemy], amount: 2 }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getDamage(enemy)).toBe(0);
  expect(game.asPlayerTwo().getDamage(own)).toBe(1);
  expect(game.asPlayerTwo().playCard(copies[1])).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(copies[1], { targets: [own] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getDamage(own)).toBe(0);
  expect(game.asPlayerTwo().playCard(copies[2])).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(1);
  expect(
    game.asPlayerTwo().resolvePendingByCard(copies[2], { targets: [copies[2]], amount: 0 }),
  ).toBeSuccessfulCommand();
  for (const copy of copies) expect(game.asServer().getCard(copy).zone).toBe("play");
  expect(game.asPlayerOne().getDamage(enemy)).toBe(0);
  expect(game.asPlayerTwo().getDamage(own)).toBe(0);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
});

it("Player Two cannot heal opposing Ward but can heal own Ward with exact retry", () => {
  const ward = createMockCharacter({
    id: "judy-ho-ward",
    name: "Ward Character",
    cost: 1,
    strength: 2,
    willpower: 5,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: ward, damage: 3 }], deck: 6 },
    { hand: [judyHoppsHelpfulOfficer], play: [{ card: ward, damage: 1 }], inkwell: 1, deck: 6 },
  );
  const enemy = game.findCardInstanceId(ward, "play", PLAYER_ONE);
  const own = game.findCardInstanceId(ward, "play", PLAYER_TWO);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(judyHoppsHelpfulOfficer)).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(judyHoppsHelpfulOfficer, { targets: [enemy] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getDamage(enemy)).toBe(3);
  expect(game.asPlayerTwo().getDamage(own)).toBe(1);
  expect(game.asPlayerTwo().getBagCount()).toBe(1);
  expect(
    game.asPlayerTwo().resolvePendingByCard(judyHoppsHelpfulOfficer, { targets: [own], amount: 2 }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getDamage(own)).toBe(0);
  expect(game.asPlayerOne().getDamage(enemy)).toBe(3);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});
