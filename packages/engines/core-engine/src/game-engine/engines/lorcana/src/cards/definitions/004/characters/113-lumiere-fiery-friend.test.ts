import { describe, expect, it } from "bun:test";
import {
  auroraTranquilPrincess,
  lumiereFieryFriend,
  pegasusFlyingSteed,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lumiere - Fiery Friend", () => {
  it("**FERVENT ADDRESS** Your other characters get +1 {S}.", () => {
    const testStore = new TestStore(
      {
        inkwell: lumiereFieryFriend.cost,
        hand: [lumiereFieryFriend],
        play: [pegasusFlyingSteed],
      },
      {
        deck: 1,
      },
    );

    const cardUnderTest = testStore.getCard(lumiereFieryFriend);
    const target = testStore.getCard(pegasusFlyingSteed);

    expect(target.strength).toBe(pegasusFlyingSteed.strength);

    cardUnderTest.playFromHand();

    expect(target.strength).toBe(pegasusFlyingSteed.strength + 1);

    testStore.passTurn();

    expect(target.strength).toBe(pegasusFlyingSteed.strength + 1);
  });

  it("Gives strength to characters with ward", () => {
    const testStore = new TestStore({
      play: [lumiereFieryFriend, auroraTranquilPrincess],
    });

    const target = testStore.getCard(auroraTranquilPrincess);
    expect(target.strength).toBe(auroraTranquilPrincess.strength + 1);
  });
});

describe("Regression Tests", () => {
  it("Doesn't give bonus to enemies", () => {
    const testStore = new TestStore(
      {
        inkwell: lumiereFieryFriend.cost,
        hand: [lumiereFieryFriend],
      },
      {
        play: [auroraTranquilPrincess],
        deck: 1,
      },
    );

    const cardUnderTest = testStore.getCard(lumiereFieryFriend);
    const target = testStore.getCard(auroraTranquilPrincess);

    expect(target.strength).toBe(auroraTranquilPrincess.strength);

    cardUnderTest.playFromHand();

    expect(target.strength).toBe(auroraTranquilPrincess.strength);

    testStore.passTurn();

    expect(target.strength).toBe(auroraTranquilPrincess.strength);
  });
});
