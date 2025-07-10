/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theMatchmakerUnforgivingExpert } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("The Matchmaker - Unforgiving Expert", () => {
  it.skip("YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: theMatchmakerUnforgivingExpert.cost,
      play: [theMatchmakerUnforgivingExpert],
      hand: [theMatchmakerUnforgivingExpert],
    });

    await testEngine.playCard(theMatchmakerUnforgivingExpert);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
