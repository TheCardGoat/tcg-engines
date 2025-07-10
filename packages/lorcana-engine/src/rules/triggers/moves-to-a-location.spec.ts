/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoLocationCard,
} from "@lorcanito/lorcana-engine";
import { locationCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { whenYouMoveACharacterHere } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import {
  royalGuardBovineProtector,
  sleepySluggishKnight,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { dealDamageToChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

const testCard: LorcanitoLocationCard = {
  ...locationCardMock,
  abilities: [
    whenYouMoveACharacterHere({
      name: "Test Ability",
      text: "",
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "characteristics", value: ["knight"] },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      },
      effects: [dealDamageToChosenCharacter(2)],
    }),
  ],
};

allCardsById[testCard.id] = testCard;

describe("On Move to a Location Trigger", () => {
  it("should deal 2 damage to chosen character, when moving a Knight", async () => {
    const testEngine = new TestEngine({
      inkwell: testCard.moveCost,
      play: [testCard, sleepySluggishKnight],
    });

    const { location, character } = await testEngine.moveToLocation({
      location: testCard,
      character: sleepySluggishKnight,
    });

    await testEngine.resolveTopOfStack({ targets: [character] });

    expect(character.damage).toBe(2);
  });

  it("should NOT deal 2 damage to chosen character, when moving a Non-Knight", async () => {
    const testEngine = new TestEngine({
      inkwell: testCard.moveCost,
      play: [testCard, royalGuardBovineProtector],
    });

    const { character } = await testEngine.moveToLocation({
      location: testCard,
      character: royalGuardBovineProtector,
    });

    expect(testEngine.stackLayers).toHaveLength(0);
    expect(character.damage).toBe(0);
  });
});
