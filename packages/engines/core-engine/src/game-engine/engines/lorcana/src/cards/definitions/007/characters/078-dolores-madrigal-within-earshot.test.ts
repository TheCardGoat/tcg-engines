/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { doloresMadrigalWithinEarshot } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Dolores Madrigal - Within Earshot", () => {
  it.skip("I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: doloresMadrigalWithinEarshot.cost,
      play: [doloresMadrigalWithinEarshot],
      hand: [doloresMadrigalWithinEarshot],
    });

    await testEngine.playCard(doloresMadrigalWithinEarshot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
