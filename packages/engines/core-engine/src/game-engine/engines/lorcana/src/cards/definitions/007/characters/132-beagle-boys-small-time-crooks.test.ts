import { describe, it } from "bun:test";
import { beagleBoysSmalltimeCrooks } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Beagle Boys - Small-Time Crooks", () => {
  it.skip("HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      inkwell: beagleBoysSmalltimeCrooks.cost,
      play: [beagleBoysSmalltimeCrooks],
      hand: [beagleBoysSmalltimeCrooks],
    });

    await testEngine.playCard(beagleBoysSmalltimeCrooks);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
