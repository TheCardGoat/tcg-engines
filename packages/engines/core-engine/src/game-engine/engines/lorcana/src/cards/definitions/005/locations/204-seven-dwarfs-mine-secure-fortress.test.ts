/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hiddenCoveTranquilHaven } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/locations";
import {
  dopeyKnightApprentice,
  mickeyMouseFoodFightDefender,
  royalGuardBovineProtector,
  sleepySluggishKnight,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { sevenDwarfsMineSecureFortress } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Seven Dwarfs' Mine - Secure Fortress", () => {
  describe("**MOUNTAIN DEFENSE** During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.", () => {
    it("should deal 2 damage to chosen character, when moving a Knight", async () => {
      const testEngine = new TestEngine({
        inkwell: sevenDwarfsMineSecureFortress.moveCost * 2,
        play: [
          sevenDwarfsMineSecureFortress,
          sleepySluggishKnight,
          dopeyKnightApprentice,
        ],
      });

      const { character } = await testEngine.moveToLocation({
        location: sevenDwarfsMineSecureFortress,
        character: sleepySluggishKnight,
      });

      await testEngine.acceptOptionalLayer();
      await testEngine.resolveTopOfStack({ targets: [character] });

      expect(character.damage).toBe(2);
      expect(testEngine.stackLayers).toHaveLength(0);

      await testEngine.moveToLocation({
        location: sevenDwarfsMineSecureFortress,
        character: dopeyKnightApprentice,
      });
      expect(testEngine.stackLayers).toHaveLength(0);
    });

    it("should deal 1 damage to chosen character, when moving a Non-Knight", async () => {
      const testEngine = new TestEngine({
        inkwell: sevenDwarfsMineSecureFortress.moveCost * 2,
        play: [
          sevenDwarfsMineSecureFortress,
          royalGuardBovineProtector,
          mickeyMouseFoodFightDefender,
        ],
      });

      const { character } = await testEngine.moveToLocation({
        location: sevenDwarfsMineSecureFortress,
        character: royalGuardBovineProtector,
      });

      await testEngine.acceptOptionalLayer();
      await testEngine.resolveTopOfStack({ targets: [character] });

      expect(character.damage).toBe(1);
      expect(testEngine.stackLayers).toHaveLength(0);

      await testEngine.moveToLocation({
        location: sevenDwarfsMineSecureFortress,
        character: mickeyMouseFoodFightDefender,
      });
      expect(testEngine.stackLayers).toHaveLength(0);
    });
  });
});

describe("Regression", () => {
  it("Do not trigger when moving to another location", async () => {
    const testEngine = new TestEngine({
      inkwell: hiddenCoveTranquilHaven.moveCost,
      play: [
        sevenDwarfsMineSecureFortress,
        hiddenCoveTranquilHaven,
        royalGuardBovineProtector,
        mickeyMouseFoodFightDefender,
      ],
    });

    await testEngine.moveToLocation({
      location: hiddenCoveTranquilHaven,
      character: royalGuardBovineProtector,
    });

    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
