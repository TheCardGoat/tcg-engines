/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mirabelMadrigalHopefulDreamer } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Mirabel Madrigal - Hopeful Dreamer", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.) Singer 5 (This character counts as cost 5 to sing songs.)", async () => {
    const testEngine = new TestEngine({
      play: [mirabelMadrigalHopefulDreamer],
    });

    const cardUnderTest = testEngine.getCardModel(
      mirabelMadrigalHopefulDreamer,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
