import { describe, it } from "bun:test";
import { theColonelOldSheepdog } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Colonel - Old Sheepdog", () => {
  it.skip("WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.", async () => {
    const testEngine = new TestEngine({
      inkwell: theColonelOldSheepdog.cost,
      play: [theColonelOldSheepdog],
      hand: [theColonelOldSheepdog],
    });

    await testEngine.playCard(theColonelOldSheepdog);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
