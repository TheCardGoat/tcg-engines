/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hypnoticStrength } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Hypnotic Strength", () => {
  it("Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: hypnoticStrength.cost,
      hand: [hypnoticStrength],
      play: [liloJuniorCakeDecorator],
    });

    expect(testEngine.getCardModel(liloJuniorCakeDecorator).hasChallenger).toBe(
      false,
    );

    await testEngine.playCard(hypnoticStrength, {
      targets: [liloJuniorCakeDecorator],
    });

    expect(testEngine.getCardModel(liloJuniorCakeDecorator).hasChallenger).toBe(
      true,
    );
    expect(testEngine.getZonesCardCount().hand).toBe(1);
  });
});
