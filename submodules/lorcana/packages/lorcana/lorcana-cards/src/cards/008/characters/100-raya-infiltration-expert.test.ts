import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rayaInfiltrationExpert } from "./100-raya-infiltration-expert";

const exertedAlly = createMockCharacter({
  id: "raya-ie-exerted-ally",
  name: "Exerted Ally",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const readyAlly = createMockCharacter({
  id: "raya-ie-ready-ally",
  name: "Ready Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Raya - Infiltration Expert", () => {
  describe("UNCONVENTIONAL TACTICS — Whenever this character quests, you may pay 2 {I} to ready another chosen character.", () => {
    it("triggers an optional bag effect when Raya quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: rayaInfiltrationExpert, isDrying: false },
            { card: exertedAlly, exerted: true },
          ],
          inkwell: 2,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().quest(rayaInfiltrationExpert)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("readies another chosen exerted character when accepted and 2 ink is paid", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: rayaInfiltrationExpert, isDrying: false },
            { card: exertedAlly, exerted: true },
          ],
          inkwell: 2,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(true);

      expect(testEngine.asPlayerOne().quest(rayaInfiltrationExpert)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rayaInfiltrationExpert, {
          resolveOptional: true,
          targets: [exertedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(false);
    });

    it("deducts 2 ink when the ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: rayaInfiltrationExpert, isDrying: false },
            { card: exertedAlly, exerted: true },
          ],
          inkwell: 2,
        },
        { deck: 1 },
      );

      const inkBefore = testEngine.asPlayerOne().getAvailableInk("player_one");

      expect(testEngine.asPlayerOne().quest(rayaInfiltrationExpert)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rayaInfiltrationExpert, {
          resolveOptional: true,
          targets: [exertedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getAvailableInk("player_one")).toBe(inkBefore - 2);
    });

    it("does not ready the character when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: rayaInfiltrationExpert, isDrying: false },
            { card: exertedAlly, exerted: true },
          ],
          inkwell: 2,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().quest(rayaInfiltrationExpert)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rayaInfiltrationExpert, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(true);
    });

    it("cannot ready itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rayaInfiltrationExpert, isDrying: false }],
          inkwell: 2,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().quest(rayaInfiltrationExpert)).toBeSuccessfulCommand();

      // Raya is exerted after questing; trying to target herself should fail
      const result = testEngine.asPlayerOne().resolvePendingByCard(rayaInfiltrationExpert, {
        resolveOptional: true,
        targets: [rayaInfiltrationExpert],
      });

      expect(result.success).toBe(false);
    });

    it("does not trigger the effect when player cannot pay 2 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: rayaInfiltrationExpert, isDrying: false },
            { card: exertedAlly, exerted: true },
          ],
          inkwell: 0,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().quest(rayaInfiltrationExpert)).toBeSuccessfulCommand();

      // With no ink, accepting should not ready the ally
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(rayaInfiltrationExpert, {
          resolveOptional: true,
          targets: [exertedAlly],
        });
      }

      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(true);
    });
  });
});
