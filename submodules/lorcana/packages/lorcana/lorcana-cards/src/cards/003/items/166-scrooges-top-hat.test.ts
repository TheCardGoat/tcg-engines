import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import type { ActivatedAbilityDefinition } from "@tcg/lorcana-types";
import { simbaScrappyCub } from "../characters";
import { wildcatsWrench } from "./031-wildcats-wrench";
import { scroogesTopHat } from "./166-scrooges-top-hat";

const payInkItem = createMockItem({
  id: "scrooge-pay-ink-item",
  name: "Pay Ink Item",
  cost: 1,
  abilities: [
    {
      id: "scrooge-pay-ink-ability",
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

const discountedItem = createMockItem({
  id: "scrooge-discounted-item",
  name: "Discounted Item",
  cost: 5,
});

const fillerDraw = createMockCharacter({
  id: "scrooge-filler-draw",
  name: "Filler Draw",
  cost: 1,
});

describe("Scrooge's Top Hat", () => {
  describe("BUSINESS EXPERTISE - {E} - You pay 1 less for the next item you play this turn", () => {
    it("reduces the cost of the next item you play this turn by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wildcatsWrench],
        inkwell: wildcatsWrench.cost - 1,
        play: [scroogesTopHat],
      });

      expect(testEngine.asPlayerOne().canPlayCard(wildcatsWrench)).toBe(false);

      const result = testEngine.asPlayerOne().activateAbility(scroogesTopHat, {
        ability: "BUSINESS EXPERTISE",
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().canPlayCard(wildcatsWrench)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(wildcatsWrench)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(scroogesTopHat)).toBe(true);
    });

    it("only reduces cost for items, not characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [simbaScrappyCub],
        inkwell: simbaScrappyCub.cost - 1,
        play: [scroogesTopHat],
      });

      expect(testEngine.asPlayerOne().canPlayCard(simbaScrappyCub)).toBe(false);

      testEngine.asPlayerOne().activateAbility(scroogesTopHat, {
        ability: "BUSINESS EXPERTISE",
      });

      expect(testEngine.asPlayerOne().canPlayCard(simbaScrappyCub)).toBe(false);
    });

    it("only reduces cost for the NEXT item, not subsequent ones", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wildcatsWrench, wildcatsWrench],
        inkwell: wildcatsWrench.cost * 2 - 1,
        play: [scroogesTopHat],
      });

      testEngine.asPlayerOne().activateAbility(scroogesTopHat, {
        ability: "BUSINESS EXPERTISE",
      });

      expect(testEngine.asPlayerOne().playCard(wildcatsWrench)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().canPlayCard(wildcatsWrench)).toBe(false);
    });

    it("does not reduce activated ability ink costs", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [scroogesTopHat, payInkItem],
        deck: [fillerDraw],
      });

      testEngine.asPlayerOne().activateAbility(scroogesTopHat, {
        ability: "BUSINESS EXPERTISE",
      });

      expect(
        testEngine.asPlayerOne().activateAbility(payInkItem, {
          ability: "PAY INK",
        }),
      ).toMatchObject({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      });
    });

    it("keeps the discount for the next item after you pay an activated ability's ink cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 5,
        hand: [discountedItem],
        play: [scroogesTopHat, payInkItem],
        deck: [fillerDraw],
      });

      expect(testEngine.asPlayerOne().canPlayCard(discountedItem)).toBe(true);

      testEngine.asPlayerOne().activateAbility(scroogesTopHat, {
        ability: "BUSINESS EXPERTISE",
      });

      testEngine.asPlayerOne().activateAbility(payInkItem, {
        ability: "PAY INK",
      });

      expect(testEngine.asPlayerOne().canPlayCard(discountedItem)).toBe(true);
    });
  });
});
