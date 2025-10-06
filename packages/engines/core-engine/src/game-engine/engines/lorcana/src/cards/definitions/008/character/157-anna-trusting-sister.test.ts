/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  annaTrustingSister,
  elsaFierceProtector,
  roquefortLockExpert,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Anna - Trusting Sister", () => {
  it("WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: annaTrustingSister.cost + elsaFierceProtector.cost,
      hand: [annaTrustingSister],
      play: [elsaFierceProtector],
      deck: [roquefortLockExpert],
    });

    const initialDeckCount = testEngine.getZonesCardCount().deck;
    const initialInkwellCount =
      annaTrustingSister.cost + elsaFierceProtector.cost;

    await testEngine.playCard(annaTrustingSister);
    await testEngine.acceptOptionalLayer();

    expect(testEngine.getZonesCardCount().inkwell).toBe(
      initialInkwellCount + 1,
    );
    expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount - 1);

    const inkwellCards = testEngine.getCardsByZone("inkwell");
    const inkedCard = inkwellCards[inkwellCards.length - 1];
    expect(inkedCard).toBeDefined();
    if (inkedCard) {
      expect(inkedCard.meta?.exerted).toBe(true);
    }
  });

  it("should NOT put a card into inkwell if Elsa is NOT in play", async () => {
    const testEngine = new TestEngine({
      inkwell: annaTrustingSister.cost,
      hand: [annaTrustingSister],
      play: [], // No Elsa in play
      deck: [roquefortLockExpert],
    });

    const initialInkwellCount = testEngine.getZonesCardCount().inkwell;
    const initialDeckCount = testEngine.getZonesCardCount().deck;

    await testEngine.playCard(annaTrustingSister);
    try {
      await testEngine.acceptOptionalLayer();
    } catch (e) {
      // Expected if no optional ability is on stack
    }

    expect(testEngine.getZonesCardCount().inkwell).toBe(initialInkwellCount);
    expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount);
  });
  it("should NOT put a card into inkwell if Elsa is in play but player declines", async () => {
    const testEngine = new TestEngine({
      inkwell: annaTrustingSister.cost + elsaFierceProtector.cost,
      hand: [annaTrustingSister],
      play: [elsaFierceProtector], // Elsa is in play
      deck: [roquefortLockExpert],
    });

    const initialInkwellCount = testEngine.getZonesCardCount().inkwell;
    const initialDeckCount = testEngine.getZonesCardCount().deck;

    await testEngine.playCard(annaTrustingSister);

    await testEngine.skipTopOfStack(); // Player chooses NOT to use the ability

    expect(testEngine.getZonesCardCount().inkwell).toBe(initialInkwellCount);
    expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount);
  });
});
