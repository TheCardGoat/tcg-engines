/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mauiDemiGod,
  stichtNewDog,
  tamatoaSoShiny,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { rayaFierceProtector } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Raya - Fierce Protector", () => {
  it("**DON'T CROSS ME** Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: rayaFierceProtector.cost,
        play: [rayaFierceProtector, stichtNewDog, mauiDemiGod],
      },
      {
        play: [tamatoaSoShiny],
      },
    );

    const cardUnderTest = testEngine.getCardModel(rayaFierceProtector);
    const damagedCharacters = [
      testEngine.getCardModel(stichtNewDog),
      testEngine.getCardModel(mauiDemiGod),
    ];
    const defender = testEngine.getCardModel(tamatoaSoShiny);
    await testEngine.tapCard(defender);

    damagedCharacters.forEach((card) => {
      card.updateCardDamage(1, "add");
    });
    await testEngine.challenge({ attacker: cardUnderTest, defender });

    expect(testEngine.getLoreForPlayer()).toBe(2);
  });
});
