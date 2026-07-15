import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { liloJuniorCakeDecorator } from "./008-lilo-junior-cake-decorator";

const supportTarget = createMockCharacter({
  id: "lilo-support-target",
  name: "Support Target",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Lilo - Junior Cake Decorator", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [liloJuniorCakeDecorator],
    });

    const cardUnderTest = testEngine.getCardModel(liloJuniorCakeDecorator);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("should trigger Support when questing, adding strength to chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [liloJuniorCakeDecorator, supportTarget],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(liloJuniorCakeDecorator)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(liloJuniorCakeDecorator, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + liloJuniorCakeDecorator.strength,
    );
  });

  it("should allow declining the Support ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [liloJuniorCakeDecorator, supportTarget],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(liloJuniorCakeDecorator)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(liloJuniorCakeDecorator, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });
});
