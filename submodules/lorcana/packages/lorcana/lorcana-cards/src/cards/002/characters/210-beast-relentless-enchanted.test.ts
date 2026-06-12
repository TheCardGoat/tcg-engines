import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { beastRelentless } from "./070-beast-relentless";
import { beastRelentlessEnchanted } from "./210-beast-relentless-enchanted";
import { fireTheCannons } from "../../001/actions/197-fire-the-cannons";
import { dragonFire } from "../../001/actions/130-dragon-fire";

const opponent = createMockCharacter({
  id: "beast-relentless-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 5,
});

const ally = createMockCharacter({
  id: "beast-relentless-ally",
  name: "Ally Character",
  cost: 2,
  strength: 3,
  willpower: 5,
});

describe("Beast - Relentless (Enchanted)", () => {
  it("matches its base printing for gameplay-relevant data", () => {
    expect(beastRelentlessEnchanted.canonicalId).toBe(beastRelentless.canonicalId);
    expect(beastRelentlessEnchanted.cost).toBe(beastRelentless.cost);
    expect(beastRelentlessEnchanted.strength).toBe(beastRelentless.strength);
    expect(beastRelentlessEnchanted.willpower).toBe(beastRelentless.willpower);
    expect(beastRelentlessEnchanted.lore).toBe(beastRelentless.lore);
    expect(beastRelentlessEnchanted.inkable).toBe(beastRelentless.inkable);
    expect(beastRelentlessEnchanted.inkType).toEqual(beastRelentless.inkType);
    expect(beastRelentlessEnchanted.classifications).toEqual(beastRelentless.classifications);
    expect(beastRelentlessEnchanted.text).toEqual(beastRelentless.text);
    expect(beastRelentlessEnchanted.abilities).toEqual(beastRelentless.abilities);
  });

  describe("SECOND WIND - Whenever an opposing character is damaged, you may ready this character", () => {
    it("readies Beast when he challenges and damages an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [beastRelentlessEnchanted],
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(beastRelentlessEnchanted, opponent),
      ).toBeSuccessfulCommand();

      // Beast should be exerted after challenging, but the damage trigger fires
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(beastRelentlessEnchanted, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(beastRelentlessEnchanted)).toBe(false);
    });

    it("readies Beast when another ally challenges and damages an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: beastRelentlessEnchanted, exerted: true }, ally],
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().challenge(ally, opponent)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(beastRelentlessEnchanted, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(beastRelentlessEnchanted)).toBe(false);
    });

    it("readies Beast when an opposing character is damaged by an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: beastRelentlessEnchanted, exerted: true }],
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [opponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(fireTheCannons)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponent] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(beastRelentlessEnchanted, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(beastRelentlessEnchanted)).toBe(false);
    });

    it("does NOT trigger when a friendly character is damaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: beastRelentlessEnchanted, exerted: true }, ally],
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(fireTheCannons)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [ally] }),
      ).toBeSuccessfulCommand();

      // Should not have a bag effect since our own character was damaged
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.isExerted(beastRelentlessEnchanted)).toBe(true);
    });

    it("does NOT trigger when an opposing character is banished without being damaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: beastRelentlessEnchanted, exerted: true }],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
        {
          play: [opponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(dragonFire)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponent] }),
      ).toBeSuccessfulCommand();

      // Dragon Fire banishes directly without dealing damage
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.isExerted(beastRelentlessEnchanted)).toBe(true);
    });

    it("is optional and can be declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: beastRelentlessEnchanted, exerted: true }],
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [opponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(fireTheCannons)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponent] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(beastRelentlessEnchanted, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(beastRelentlessEnchanted)).toBe(true);
    });
  });
});
