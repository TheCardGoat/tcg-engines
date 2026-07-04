import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { meridaWispConjurer } from "./050-merida-wisp-conjurer";

const focusedEnergyDraw = createMockCharacter({
  id: "merida-wisp-conjurer-focused-energy-draw",
  name: "Focused Energy Draw",
  cost: 1,
});

const beckonDraw = createMockCharacter({
  id: "merida-wisp-conjurer-beckon-draw",
  name: "Beckon Draw",
  cost: 1,
});

const stackedDrawOne = createMockCharacter({
  id: "merida-wisp-conjurer-stacked-draw-one",
  name: "Stacked Draw One",
  cost: 1,
});

const stackedDrawTwo = createMockCharacter({
  id: "merida-wisp-conjurer-stacked-draw-two",
  name: "Stacked Draw Two",
  cost: 1,
});

const stackedDrawThree = createMockCharacter({
  id: "merida-wisp-conjurer-stacked-draw-three",
  name: "Stacked Draw Three",
  cost: 1,
});

const stackedDrawFour = createMockCharacter({
  id: "merida-wisp-conjurer-stacked-draw-four",
  name: "Stacked Draw Four",
  cost: 1,
});

const stackedDrawFive = createMockCharacter({
  id: "merida-wisp-conjurer-stacked-draw-five",
  name: "Stacked Draw Five",
  cost: 1,
});

const stackedDrawSix = createMockCharacter({
  id: "merida-wisp-conjurer-stacked-draw-six",
  name: "Stacked Draw Six",
  cost: 1,
});

const exertedEntrant = createMockCharacter({
  id: "merida-wisp-conjurer-exerted-entrant",
  name: "Exerted Entrant",
  cost: 1,
  abilities: [
    {
      type: "static",
      name: "Entry Option",
      effect: {
        type: "restriction",
        restriction: "may-enter-play-exerted",
        target: "SELF",
      },
    },
  ],
});

const bodyguardEntrant = createMockCharacter({
  id: "merida-wisp-conjurer-bodyguard-entrant",
  name: "Bodyguard Entrant",
  cost: 1,
  abilities: [bodyguard],
});

describe("Merida - Wisp Conjurer", () => {
  it("may enter play exerted to draw a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [meridaWispConjurer],
      deck: [focusedEnergyDraw],
      inkwell: meridaWispConjurer.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(meridaWispConjurer, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(meridaWispConjurer)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(focusedEnergyDraw)).toBe("hand");
  });

  it("may draw a card when another character of yours enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meridaWispConjurer],
      hand: [exertedEntrant],
      deck: [beckonDraw],
      inkwell: exertedEntrant.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(exertedEntrant, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(meridaWispConjurer, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(exertedEntrant)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(beckonDraw)).toBe("hand");
  });

  it("stacks Beckon for each Merida already in play when another Merida enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [meridaWispConjurer, meridaWispConjurer, meridaWispConjurer],
      deck: [
        stackedDrawOne,
        stackedDrawTwo,
        stackedDrawThree,
        stackedDrawFour,
        stackedDrawFive,
        stackedDrawSix,
      ],
      inkwell: meridaWispConjurer.cost * 3,
    });

    const firstMerida = testEngine.getCardInstanceIdsInZone("hand", "player_one")[0];
    expect(
      testEngine.asPlayerOne().playCard(firstMerida, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    const secondMerida = testEngine.getCardInstanceIdsInZone("hand", "player_one")[0];
    expect(
      testEngine.asPlayerOne().playCard(secondMerida, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
    ).toBeSuccessfulCommand();

    const thirdMerida = testEngine.getCardInstanceIdsInZone("hand", "player_one")[0];
    expect(
      testEngine.asPlayerOne().playCard(thirdMerida, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ play: 3, hand: 6, deck: 0 });
  });

  it("may draw a card when a Bodyguard character enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meridaWispConjurer],
      hand: [bodyguardEntrant],
      deck: [beckonDraw],
      inkwell: bodyguardEntrant.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(bodyguardEntrant, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(meridaWispConjurer, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(bodyguardEntrant)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(beckonDraw)).toBe("hand");
  });
});
