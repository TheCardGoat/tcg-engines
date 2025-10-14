import { describe, expect, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { brunoMadrigalUndetectedUncle } from "./000-bruno-madrigal-undetected-uncle";

describe("Bruno Madrigal - Undetected Uncle", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", async () => {
    const testEngine = new TestEngine({
      play: [brunoMadrigalUndetectedUncle],
    });

    const cardUnderTest = testEngine.getCardModel(brunoMadrigalUndetectedUncle);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("**YOU JUST HAVE TO SEE IT** {E} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand and gain 3 lore. Otherwise, put it on the top of your deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: brunoMadrigalUndetectedUncle.cost,
      play: [brunoMadrigalUndetectedUncle],
      hand: [brunoMadrigalUndetectedUncle],
    });

    await testEngine.playCard(brunoMadrigalUndetectedUncle);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
