/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theMusesProclaimersOfHeroes } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { fidgetSneakyBat } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("EVASIVE (Only characters with Evasive can challenge this character.)", () => {
  it.skip("", async () => {
    const testEngine = new TestEngine({
      inkwell: fidgetSneakyBat.cost,
      play: [fidgetSneakyBat],
      hand: [fidgetSneakyBat],
    });

    await testEngine.playCard(fidgetSneakyBat);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});

describe("TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gain Evasive until the start of your next turn.", () => {
  it("another character should gain Evasive", async () => {
    const testEngine = new TestEngine({
      inkwell: fidgetSneakyBat.cost,
      play: [fidgetSneakyBat, theMusesProclaimersOfHeroes],
      hand: [],
    });

    const target = testEngine.getCardModel(theMusesProclaimersOfHeroes);

    expect(target.hasEvasive).toBe(false);

    await testEngine.questCard(fidgetSneakyBat);

    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.hasEvasive).toBe(true);
  });
});
