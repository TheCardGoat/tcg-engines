import { describe, expect, it } from "bun:test";
import { theLibraryAGiftForBelle } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/068-the-library-a-gift-for-belle";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { goofySetForAdventure } from "~/game-engine/engines/lorcana/src/cards/definitions/009";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Goofy - Set for Adventure", () => {
  it("FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: goofySetForAdventure.cost,
      play: [
        goofySetForAdventure,
        theLibraryAGiftForBelle,
        deweyLovableShowoff,
      ],
    });

    await testEngine.moveToLocation({
      location: theLibraryAGiftForBelle,
      character: goofySetForAdventure,
    });

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack(
      { targets: [deweyLovableShowoff] },
      true,
    );
    await testEngine.resolveTopOfStack({ targets: [theLibraryAGiftForBelle] });

    const location = testEngine.getCardModel(theLibraryAGiftForBelle);

    expect(location.getCardsAtLocation).toHaveLength(2);
    expect(
      testEngine.getCardModel(deweyLovableShowoff).isAtLocation(location),
    ).toBe(true);
  });
});
