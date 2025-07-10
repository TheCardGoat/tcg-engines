/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  hiroHamadaIntuitiveThinker,
  lumiereFiredUp,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Hiro Hamada - Intuitive Thinker", () => {
  it("LOOK FOR A NEW ANGLE {E} - Ready chosen Floodborn character.", async () => {
    const testEngine = new TestEngine({
      play: [hiroHamadaIntuitiveThinker, lumiereFiredUp],
    });

    const cardUnderTest = testEngine.getCardModel(hiroHamadaIntuitiveThinker);
    const target = testEngine.getCardModel(lumiereFiredUp);

    target.exert();

    await testEngine.activateCard(cardUnderTest, {
      ability: "LOOK FOR A NEW ANGLE",
      targets: [target],
    });

    expect(target.exerted).toBe(false);
  });
});
