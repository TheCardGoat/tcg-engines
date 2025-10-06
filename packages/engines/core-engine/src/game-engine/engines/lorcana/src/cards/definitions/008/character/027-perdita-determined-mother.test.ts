/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cruellaDeVilFashionableCruiser } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  dalmatianPuppyTailWagger,
  patchPlayfulPup,
  perditaDeterminedMother,
  rollyChubbyPuppy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Perdita - Determined Mother", () => {
  it("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Perdita.)", async () => {
    const testEngine = new TestEngine({
      play: [perditaDeterminedMother],
    });

    const cardUnderTest = testEngine.getCardModel(perditaDeterminedMother);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("QUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: perditaDeterminedMother.cost,
      hand: [perditaDeterminedMother],
      discard: [
        rollyChubbyPuppy,
        patchPlayfulPup,
        dalmatianPuppyTailWagger,
        cruellaDeVilFashionableCruiser,
      ],
    });

    await testEngine.playCard(perditaDeterminedMother);
    await testEngine.resolveOptionalAbility();

    expect(testEngine.getCardModel(rollyChubbyPuppy).zone).toBe("inkwell");
    expect(testEngine.getCardModel(rollyChubbyPuppy).meta.exerted).toBe(true);

    expect(testEngine.getCardModel(patchPlayfulPup).zone).toBe("inkwell");
    expect(testEngine.getCardModel(patchPlayfulPup).meta.exerted).toBe(true);

    expect(testEngine.getCardModel(dalmatianPuppyTailWagger).zone).toBe(
      "inkwell",
    );
    expect(testEngine.getCardModel(dalmatianPuppyTailWagger).meta.exerted).toBe(
      true,
    );

    expect(testEngine.getCardModel(cruellaDeVilFashionableCruiser).zone).toBe(
      "discard",
    );
    expect(
      testEngine.getCardModel(cruellaDeVilFashionableCruiser).meta.exerted,
    ).toBeFalsy();
  });
});
