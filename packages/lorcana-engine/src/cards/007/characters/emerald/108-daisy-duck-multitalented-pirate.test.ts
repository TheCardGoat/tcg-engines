/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  anastasiaBossyStepsister,
  daisyDuckMultitalentedPirate,
  johnSilverVengefulPirate,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Daisy Duck - Multitalented Pirate", () => {
  it("FOWL PLAY Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.", async () => {
    const testEngine = new TestEngine(
      {
        play: [daisyDuckMultitalentedPirate],
        hand: [johnSilverVengefulPirate],
      },
      {
        play: [anastasiaBossyStepsister],
      },
    );

    await testEngine.putIntoInkwell(johnSilverVengefulPirate);

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveTopOfStack({
      targets: [anastasiaBossyStepsister],
    });

    expect(testEngine.getCardModel(anastasiaBossyStepsister).zone).toBe("hand");
  });
});
