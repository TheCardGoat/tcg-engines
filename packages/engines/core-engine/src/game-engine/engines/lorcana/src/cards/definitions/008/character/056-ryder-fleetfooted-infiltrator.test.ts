/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ryderFleetfootedInfiltrator } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Ryder - Fleet-Footed Infiltrator", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [ryderFleetfootedInfiltrator],
    });

    const cardUnderTest = testEngine.getCardModel(ryderFleetfootedInfiltrator);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
