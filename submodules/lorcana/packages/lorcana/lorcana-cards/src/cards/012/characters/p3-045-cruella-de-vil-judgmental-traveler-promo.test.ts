import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cruellaDeVilJudgmentalTravelerP3Promo } from "./p3-045-cruella-de-vil-judgmental-traveler-promo";

const anotherCharacter = createMockCharacter({
  id: "cruella-promo-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const damagedTarget = createMockCharacter({
  id: "cruella-promo-target",
  name: "Damaged Target",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Cruella De Vil - Judgmental Traveler (Promo)", () => {
  it("YOU'RE OUT OF FASHION - banishes chosen damaged character when questing after playing another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [anotherCharacter],
        play: [cruellaDeVilJudgmentalTravelerP3Promo],
        inkwell: 1,
        deck: 5,
      },
      {
        play: [{ card: damagedTarget, damage: 1 }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().quest(cruellaDeVilJudgmentalTravelerP3Promo),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cruellaDeVilJudgmentalTravelerP3Promo, {
        resolveOptional: true,
        targets: [damagedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(damagedTarget)).toBe("discard");
  });
});
