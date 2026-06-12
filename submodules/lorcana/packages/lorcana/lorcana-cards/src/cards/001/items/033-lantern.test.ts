import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import type { ActivatedAbilityDefinition } from "@tcg/lorcana-types";
import { mickeyMouseTrueFriend, stitchRockStar } from "../characters";
import { lantern } from "./033-lantern";

const payInkCharacter = createMockCharacter({
  id: "lantern-pay-ink-character",
  name: "Lantern Pay Ink Character",
  cost: 2,
  abilities: [
    {
      id: "lantern-pay-ink-ability",
      name: "PAY INK",
      type: "activated",
      cost: { ink: 1 },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      text: "PAY INK {I} - Draw a card.",
    } satisfies ActivatedAbilityDefinition,
  ],
});

const discountedCharacter = createMockCharacter({
  id: "lantern-discounted-character",
  name: "Lantern Discounted Character",
  cost: 5,
});

const fillerDraw = createMockCharacter({
  id: "lantern-filler-draw",
  name: "Lantern Filler Draw",
  cost: 1,
});

describe("Lantern", () => {
  it("reduces the cost of the next character you play this turn by 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseTrueFriend],
      inkwell: mickeyMouseTrueFriend.cost - 1,
      play: [lantern],
    });

    expect(testEngine.asPlayerOne().canPlayCard(mickeyMouseTrueFriend)).toBe(false);
    expect(
      testEngine.asPlayerOne().activateAbility(lantern, {
        ability: "BIRTHDAY LIGHTS",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().canPlayCard(mickeyMouseTrueFriend)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(mickeyMouseTrueFriend)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(lantern)).toBe(true);
  });

  it("only discounts the first character you play that turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
      inkwell: 5,
      play: [lantern],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(lantern, {
        ability: "BIRTHDAY LIGHTS",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(mickeyMouseTrueFriend)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canPlayCard(mickeyMouseTrueFriend)).toBe(false);
  });

  it("does not change a character's printed cost for Stitch - Rock Star", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseTrueFriend],
      inkwell: mickeyMouseTrueFriend.cost - 1,
      play: [lantern, stitchRockStar],
      deck: [fillerDraw],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(lantern, {
        ability: "BIRTHDAY LIGHTS",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(mickeyMouseTrueFriend)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("play");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("does not reduce activated ability ink costs", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 0,
      play: [lantern, payInkCharacter],
      deck: [fillerDraw],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(lantern, {
        ability: "BIRTHDAY LIGHTS",
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(payInkCharacter, {
        ability: "PAY INK",
      }),
    ).toMatchObject({
      success: false,
      errorCode: "INSUFFICIENT_INK",
    });
  });

  it("keeps the discount for the next character after you pay an activated ability's ink cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 5,
      hand: [discountedCharacter],
      play: [lantern, payInkCharacter],
      deck: [fillerDraw],
    });

    expect(testEngine.asPlayerOne().canPlayCard(discountedCharacter)).toBe(true);
    expect(
      testEngine.asPlayerOne().activateAbility(lantern, {
        ability: "BIRTHDAY LIGHTS",
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(payInkCharacter, {
        ability: "PAY INK",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canPlayCard(discountedCharacter)).toBe(true);
  });
});
