/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { instituteOfTechnologyPrestigiousUniversity } from "~/game-engine/engines/lorcana/src/cards/definitions/006/locations/locations";

describe("Institute of Technology - Prestigious University", () => {
  it.skip("WELCOME TO THE LAB Inventor characters get +1 {W} while here.", async () => {
    const testEngine = new TestEngine({
      inkwell: instituteOfTechnologyPrestigiousUniversity.cost,
      play: [instituteOfTechnologyPrestigiousUniversity],
      hand: [instituteOfTechnologyPrestigiousUniversity],
    });

    await testEngine.playCard(instituteOfTechnologyPrestigiousUniversity);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("PUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: instituteOfTechnologyPrestigiousUniversity.cost,
      play: [instituteOfTechnologyPrestigiousUniversity],
      hand: [instituteOfTechnologyPrestigiousUniversity],
    });

    await testEngine.playCard(instituteOfTechnologyPrestigiousUniversity);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
