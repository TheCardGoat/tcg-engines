/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { theMatchmakerUnforgivingExpert } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

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
