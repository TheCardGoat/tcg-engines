import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { coconutBasket } from "./169-coconut-basket";

const damagedFriend = createMockCharacter({
  id: "coconut-basket-damaged-friend",
  name: "Damaged Friend",
  cost: 2,
  willpower: 5,
});

const lightlyDamagedFriend = createMockCharacter({
  id: "coconut-basket-lightly-damaged-friend",
  name: "Lightly Damaged Friend",
  cost: 2,
  willpower: 4,
});

const playedCharacter = createMockCharacter({
  id: "coconut-basket-played-character",
  name: "Played Character",
  cost: 1,
});

describe("Coconut Basket", () => {
  it("removes 2 damage when you play a character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [playedCharacter],
      inkwell: playedCharacter.cost,
      play: [coconutBasket, damagedFriend],
    });

    testEngine.asServer().manualSetDamage(damagedFriend, 3);

    expect(testEngine.asPlayerOne().playCard(playedCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(coconutBasket)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [damagedFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damagedFriend)).toBe(1);
  });

  it("can remove less than 2 damage from the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [playedCharacter],
      inkwell: playedCharacter.cost,
      play: [coconutBasket, lightlyDamagedFriend],
    });

    testEngine.asServer().manualSetDamage(lightlyDamagedFriend, 1);

    expect(testEngine.asPlayerOne().playCard(playedCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(coconutBasket)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [lightlyDamagedFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(lightlyDamagedFriend)).toBe(0);
  });

  it("regression: allows choosing to remove only 1 damage when character has 2+ damage (up to 2, not exactly 2)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [playedCharacter],
      inkwell: playedCharacter.cost,
      play: [coconutBasket, damagedFriend],
    });

    testEngine.asServer().manualSetDamage(damagedFriend, 3);

    expect(testEngine.asPlayerOne().playCard(playedCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(coconutBasket)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [damagedFriend],
        amount: 1,
      }),
    ).toBeSuccessfulCommand();

    // Should have removed only 1 damage, leaving 2
    expect(testEngine.asPlayerOne().getDamage(damagedFriend)).toBe(2);
  });

  it("lets you decline the healing trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [playedCharacter],
      inkwell: playedCharacter.cost,
      play: [coconutBasket, damagedFriend],
    });

    testEngine.asServer().manualSetDamage(damagedFriend, 2);

    expect(testEngine.asPlayerOne().playCard(playedCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(coconutBasket, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damagedFriend)).toBe(2);
  });
});
