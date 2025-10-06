/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { camiloMadrigalPrankster } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Camilo Madrigal - Prankster", () => {
  it.skip("**MANY FORMS** At the start of your turn, you may chose one:", async () => {
    const testEngine = new TestEngine({
      inkwell: camiloMadrigalPrankster.cost,
      play: [camiloMadrigalPrankster],
      hand: [camiloMadrigalPrankster],
    });

    await testEngine.playCard(camiloMadrigalPrankster);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("• This character gets +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: camiloMadrigalPrankster.cost,
      play: [camiloMadrigalPrankster],
      hand: [camiloMadrigalPrankster],
    });

    await testEngine.playCard(camiloMadrigalPrankster);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: camiloMadrigalPrankster.cost,
      play: [camiloMadrigalPrankster],
      hand: [camiloMadrigalPrankster],
    });

    await testEngine.playCard(camiloMadrigalPrankster);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
