/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ryderFleetfootedInfiltrator } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ryder - Fleet-Footed Infiltrator", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [ryderFleetfootedInfiltrator],
    });

    const cardUnderTest = testEngine.getCardModel(ryderFleetfootedInfiltrator);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
