/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ticktockEverpresentPursuer } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Tick-Tock - Ever-Present Pursuer", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", async () => {
    const testEngine = new TestEngine({
      play: [ticktockEverpresentPursuer],
    });

    const cardUnderTest = testEngine.getCardModel(ticktockEverpresentPursuer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
