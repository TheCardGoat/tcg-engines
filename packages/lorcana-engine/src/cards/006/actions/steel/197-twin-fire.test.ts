/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  gadgetHackwrenchPerceptiveMouse,
  nickWildeCleverFox,
  sailTheAzuriteSea,
  twinFire,
} from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Twin Fire", () => {
  it("Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: twinFire.cost,
        hand: [twinFire, sailTheAzuriteSea],
      },
      {
        play: [gadgetHackwrenchPerceptiveMouse, nickWildeCleverFox],
      },
    );

    await testEngine.playCard(twinFire);

    await testEngine.resolveTopOfStack(
      {
        targets: [gadgetHackwrenchPerceptiveMouse],
      },
      true,
    );

    expect(
      testEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).damage,
    ).toBe(2);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack(
      {
        targets: [sailTheAzuriteSea],
      },
      true,
    );
    expect(testEngine.getCardModel(sailTheAzuriteSea).zone).toBe("discard");

    await testEngine.resolveTopOfStack({
      targets: [nickWildeCleverFox],
    });
    expect(testEngine.getCardModel(nickWildeCleverFox).damage).toBe(2);
  });
});
