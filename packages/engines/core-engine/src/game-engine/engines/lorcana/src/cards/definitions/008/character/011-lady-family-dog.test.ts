/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { goofyDaredevil } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/111-goofy-daredevil";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/184-lilo-galactic-hero";
import { liloJuniorCakeDecorator } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/008-lilo-junior-cake-decorator";
import { trampStreetSmartDog } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  hueyReliableLeader,
  ladyFamilyDog,
  liloCausingAnUproar,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import { liloBestExplorerEver } from "~/game-engine/engines/lorcana/src/cards/definitions/009";

describe("Lady - Family Dog", () => {
  it("SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: ladyFamilyDog.cost,
      hand: [hueyReliableLeader, ladyFamilyDog],
    });

    await testEngine.playCard(ladyFamilyDog);
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [hueyReliableLeader] });
    expect(testEngine.getCardModel(hueyReliableLeader).zone).toEqual("play");
  });

  describe("Regression", () => {
    it.only("Tramp interaction", async () => {
      const testEngine = new TestEngine({
        inkwell: ladyFamilyDog.cost,
        play: [
          goofyDaredevil,
          liloBestExplorerEver,
          liloCausingAnUproar,
          liloGalacticHero,
          liloJuniorCakeDecorator,
        ],
        hand: [hueyReliableLeader, ladyFamilyDog, trampStreetSmartDog],
      });

      await testEngine.playCard(ladyFamilyDog);
      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack(
        { targets: [trampStreetSmartDog] },
        true,
      );
      expect(testEngine.getCardModel(hueyReliableLeader).zone).toEqual("hand");
    });
  });
});
