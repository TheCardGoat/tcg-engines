import { describe, expect, it } from "bun:test";
import { imStillHere } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("I'm Still Here", () => {
  it.skip("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: imStillHere.cost,
      play: [imStillHere],
      hand: [imStillHere],
    });

    await testEngine.playCard(imStillHere);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Chosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)", async () => {
    const testEngine = new TestEngine({
      inkwell: imStillHere.cost,
      play: [imStillHere],
      hand: [imStillHere],
    });

    await testEngine.playCard(imStillHere);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
