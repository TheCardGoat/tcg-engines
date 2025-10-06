/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { kenaiBigBrother } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { brawl } from "../../004/actions/130-brawl";
import { kodaSmallishBear } from "../../007";
import {
  charlotteLaBouffMardiGrasPrincess,
  deweyLovableShowoff,
} from "../../008";

describe("Kenai - Big Brother", () => {
  it("**BROTHERS FOREVER** While this character is exerted, your characters named Koda can’t be challenged.", () => {
    const testStore = new TestEngine(
      {
        inkwell: kenaiBigBrother.cost,
        play: [
          kenaiBigBrother,
          kodaSmallishBear,
          charlotteLaBouffMardiGrasPrincess,
        ],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testStore.getCardModel(kenaiBigBrother);
    const coda = testStore.getCardModel(kodaSmallishBear);
    const oppoCard = testStore.getCardModel(deweyLovableShowoff);
    const charlotte = testStore.getCardModel(charlotteLaBouffMardiGrasPrincess);

    cardUnderTest.exert();
    coda.exert();
    charlotte.exert();

    expect(cardUnderTest.exerted).toBe(true);
    expect(coda.exerted).toBe(true);

    testStore.passTurn();

    expect(coda.canBeChallenged(oppoCard)).toBe(false);
    expect(charlotte.canBeChallenged(oppoCard)).toBe(true);

    testStore.challenge({
      attacker: oppoCard,
      defender: coda,
    });

    expect(coda.zone).toEqual("play");

    testStore.challenge({
      attacker: oppoCard,
      defender: charlotte,
    });

    expect(charlotte.zone).toEqual("discard");
  });

  it("**BROTHERS FOREVER** While this character is exerted, your characters named Koda can’t be challenged. But if Kenai will be banished, koda can be challenged.", async () => {
    const testStore = new TestEngine(
      {
        inkwell: kenaiBigBrother.cost,
        play: [
          kenaiBigBrother,
          kodaSmallishBear,
          charlotteLaBouffMardiGrasPrincess,
        ],
      },
      {
        inkwell: brawl.cost,
        hand: [brawl],
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testStore.getCardModel(kenaiBigBrother);
    const coda = testStore.getCardModel(kodaSmallishBear);
    const oppoCard = testStore.getCardModel(deweyLovableShowoff);
    const charlotte = testStore.getCardModel(charlotteLaBouffMardiGrasPrincess);

    cardUnderTest.exert();
    coda.exert();
    charlotte.exert();

    expect(cardUnderTest.exerted).toBe(true);
    expect(coda.exerted).toBe(true);

    testStore.passTurn();

    expect(coda.canBeChallenged(oppoCard)).toBe(false);
    expect(charlotte.canBeChallenged(oppoCard)).toBe(true);

    testStore.playCard(brawl);
    testStore.resolveTopOfStack({ targets: [cardUnderTest] });

    expect(cardUnderTest.zone).toEqual("discard");
    expect(coda.zone).toEqual("play");
    expect(charlotte.zone).toEqual("play");

    expect(coda.canBeChallenged(oppoCard)).toBe(true);
    expect(charlotte.canBeChallenged(oppoCard)).toBe(true);
  });
});
