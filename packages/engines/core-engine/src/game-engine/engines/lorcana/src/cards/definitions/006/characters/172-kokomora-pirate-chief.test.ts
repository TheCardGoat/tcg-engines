import { describe, expect, it } from "bun:test";
import {
  gadgetHackwrenchBrilliantBosun,
  galacticCouncilChamber,
  kakamoraBoardingParty,
  kokomoraPirateChief,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kokomora - Pirate Chief", () => {
  describe("COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.", () => {
    it("Discard a non-pirate card", async () => {
      const testEngine = new TestEngine(
        {
          play: [kokomoraPirateChief, galacticCouncilChamber],
          hand: [gadgetHackwrenchBrilliantBosun],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      await testEngine.questCard(kokomoraPirateChief);

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack(
        {
          targets: [gadgetHackwrenchBrilliantBosun],
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        targets: [galacticCouncilChamber],
      });

      expect(testEngine.getCardModel(galacticCouncilChamber).damage).toBe(1);
    });

    it("Discard a pirate card", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: kokomoraPirateChief.cost,
          play: [kokomoraPirateChief, galacticCouncilChamber],
          hand: [kakamoraBoardingParty],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      await testEngine.questCard(kokomoraPirateChief);

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack(
        {
          targets: [kakamoraBoardingParty],
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        targets: [galacticCouncilChamber],
      });

      expect(testEngine.getCardModel(galacticCouncilChamber).damage).toBe(3);
    });
  });
});
