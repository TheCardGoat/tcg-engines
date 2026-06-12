import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { beastRelentless } from "./070-beast-relentless";
import { fireTheCannons } from "../../001/actions/197-fire-the-cannons";
import { dragonFire } from "../../001/actions/130-dragon-fire";

const opponent = createMockCharacter({
  id: "beast-test-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const friendlyAttacker = createMockCharacter({
  id: "beast-test-friendly",
  name: "Friendly Attacker",
  cost: 3,
  strength: 3,
  willpower: 4,
});

describe("Beast - Relentless", () => {
  describe("SECOND WIND — Whenever an opposing character is damaged, you may ready this character.", () => {
    it("readies Beast when he himself challenges an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: beastRelentless, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().challenge(beastRelentless, opponent)).toBeSuccessfulCommand();

      // Beast exerts to challenge, but the trigger should fire
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(beastRelentless, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Beast should be ready again after Second Wind resolves
      expect(testEngine.asPlayerOne().getCard(beastRelentless).exerted).toBe(false);
    });

    it("readies Beast when another friendly character damages an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: beastRelentless, isDrying: false, exerted: true },
            { card: friendlyAttacker, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 2,
        },
      );

      // Verify Beast starts exerted
      expect(testEngine.asPlayerOne().getCard(beastRelentless).exerted).toBe(true);

      expect(
        testEngine.asPlayerOne().challenge(friendlyAttacker, opponent),
      ).toBeSuccessfulCommand();

      // Trigger should fire for Beast
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(beastRelentless, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Beast should be readied
      expect(testEngine.asPlayerOne().getCard(beastRelentless).exerted).toBe(false);
    });

    it("readies Beast when an action deals damage to an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: beastRelentless, isDrying: false, exerted: true }],
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
          deck: 2,
        },
        {
          play: [opponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCard(beastRelentless).exerted).toBe(true);

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [opponent] }),
      ).toBeSuccessfulCommand();

      // Trigger should fire for Beast
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(beastRelentless, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Beast should be readied
      expect(testEngine.asPlayerOne().getCard(beastRelentless).exerted).toBe(false);
    });

    it("does NOT trigger when your own character is damaged", () => {
      const ownTarget = createMockCharacter({
        id: "beast-test-own-target",
        name: "Own Target",
        cost: 2,
        strength: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: beastRelentless, isDrying: false, exerted: true }, ownTarget],
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCard(beastRelentless).exerted).toBe(true);

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [ownTarget] }),
      ).toBeSuccessfulCommand();

      // No trigger should fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Beast stays exerted
      expect(testEngine.asPlayerOne().getCard(beastRelentless).exerted).toBe(true);
    });

    it("does NOT trigger when an opposing character is banished (not damaged)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: beastRelentless, isDrying: false, exerted: true }],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 2,
        },
        {
          play: [opponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCard(beastRelentless).exerted).toBe(true);

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [opponent] }),
      ).toBeSuccessfulCommand();

      // No trigger should fire (banish is not damage)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Beast stays exerted
      expect(testEngine.asPlayerOne().getCard(beastRelentless).exerted).toBe(true);
    });
  });
});
