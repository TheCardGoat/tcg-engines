/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { gastonBaritoneBully } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/008-gaston-baritone-bully";
import {
  arielSingingMermaid,
  littleJohnSirReginald,
} from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Little John - Sir Reginald", () => {
  it.skip("WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:", async () => {
    const testEngine = new TestEngine({
      inkwell: littleJohnSirReginald.cost,
      hand: [littleJohnSirReginald],
    });

    await testEngine.playCard(littleJohnSirReginald);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });

  it("- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)", async () => {
    const testEngine = new TestEngine({
      inkwell: littleJohnSirReginald.cost,
      play: [arielSingingMermaid],
      hand: [littleJohnSirReginald],
    });

    const cardUnderTest = testEngine.getCardModel(littleJohnSirReginald);
    const target = testEngine.getCardModel(arielSingingMermaid);

    await testEngine.playCard(
      cardUnderTest,
      {
        mode: "1",
      },
      true,
    );

    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.hasResist).toBe(true);
  });

  it("- Deal 2 damage to chosen Villain character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: littleJohnSirReginald.cost,
        hand: [littleJohnSirReginald],
      },
      {
        play: [gastonBaritoneBully],
      },
    );

    const cardUnderTest = testEngine.getCardModel(littleJohnSirReginald);
    const target = testEngine.getCardModel(gastonBaritoneBully);

    await testEngine.playCard(
      cardUnderTest,
      {
        mode: "2",
      },
      true,
    );

    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.damage).toBe(2);
  });
});
