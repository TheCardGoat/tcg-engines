/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  perditaDeterminedMother,
  rollyChubbyPuppy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Rolly - Chubby Puppy", () => {
  it("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [rollyChubbyPuppy],
    });

    const cardUnderTest = testEngine.getCardModel(rollyChubbyPuppy);
    expect(cardUnderTest.hasSupport).toBe(true);
  });

  it("ADORABLE ANTICS When you play this character, you may put a character card from your discard in your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: rollyChubbyPuppy.cost,
      hand: [rollyChubbyPuppy],
      discard: [perditaDeterminedMother],
    });

    await testEngine.playCard(rollyChubbyPuppy);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [perditaDeterminedMother] });
    expect(testEngine.getCardModel(perditaDeterminedMother).zone).toBe(
      "inkwell",
    );
    expect(testEngine.getCardModel(perditaDeterminedMother).meta.exerted).toBe(
      true,
    );
  });

  it("ADORABLE ANTICS When you play this character, you may put a character card from your discard in your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: rollyChubbyPuppy.cost,
      hand: [rollyChubbyPuppy],
      discard: [perditaDeterminedMother],
    });

    await testEngine.playCard(rollyChubbyPuppy);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [perditaDeterminedMother] });

    expect(testEngine.getCardModel(perditaDeterminedMother).zone).toBe(
      "inkwell",
    );
    expect(testEngine.getCardModel(perditaDeterminedMother).meta.exerted).toBe(
      true,
    );
  });
});
