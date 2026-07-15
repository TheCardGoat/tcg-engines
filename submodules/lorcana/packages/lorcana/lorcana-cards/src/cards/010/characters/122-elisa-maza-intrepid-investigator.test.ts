import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { elisaMazaIntrepidInvestigator } from "./122-elisa-maza-intrepid-investigator";

const strongCharacter1 = createMockCharacter({
  id: "strong-char-1",
  name: "Strong Char 1",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 2,
});

const strongCharacter2 = createMockCharacter({
  id: "strong-char-2",
  name: "Strong Char 2",
  cost: 4,
  strength: 6,
  willpower: 3,
  lore: 2,
});

const weakCharacter = createMockCharacter({
  id: "weak-char",
  name: "Weak Char",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
});

describe("Elisa Maza - Intrepid Investigator", () => {
  it("should have correct base stats", () => {
    expect(elisaMazaIntrepidInvestigator.cost).toBe(3);
    expect(elisaMazaIntrepidInvestigator.strength).toBe(4);
    expect(elisaMazaIntrepidInvestigator.willpower).toBe(3);
    expect(elisaMazaIntrepidInvestigator.lore).toBe(1);
    expect(elisaMazaIntrepidInvestigator.inkType).toEqual(["ruby"]);
    expect(elisaMazaIntrepidInvestigator.classifications).toEqual([
      "Storyborn",
      "Hero",
      "Detective",
    ]);
  });

  it("SPECIAL DETAIL - Gets +2 lore when you have 2 or more other characters with strength 5+", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elisaMazaIntrepidInvestigator],
        play: [strongCharacter1, strongCharacter2],
        inkwell: elisaMazaIntrepidInvestigator.cost,
      },
      {
        hand: [],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(elisaMazaIntrepidInvestigator),
    ).toBeSuccessfulCommand();

    const elisaInPlay = testEngine.asPlayerOne().getCard(elisaMazaIntrepidInvestigator);
    // Should have +2 lore bonus when 2+ characters with strength 5+
    expect(elisaInPlay?.lore).toBe(elisaMazaIntrepidInvestigator.lore + 2);
  });

  it("SPECIAL DETAIL - Gets no bonus when there is only 1 character with strength 5+", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elisaMazaIntrepidInvestigator],
        play: [strongCharacter1, weakCharacter],
        inkwell: elisaMazaIntrepidInvestigator.cost,
      },
      {
        hand: [],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(elisaMazaIntrepidInvestigator),
    ).toBeSuccessfulCommand();

    const elisaInPlay = testEngine.asPlayerOne().getCard(elisaMazaIntrepidInvestigator);
    // Should have base lore when fewer than 2 characters with strength 5+
    expect(elisaInPlay?.lore).toBe(elisaMazaIntrepidInvestigator.lore);
  });

  it("SPECIAL DETAIL - Gets no bonus when there are no other characters with strength 5+", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elisaMazaIntrepidInvestigator],
        play: [weakCharacter],
        inkwell: elisaMazaIntrepidInvestigator.cost,
      },
      {
        hand: [],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(elisaMazaIntrepidInvestigator),
    ).toBeSuccessfulCommand();

    const elisaInPlay = testEngine.asPlayerOne().getCard(elisaMazaIntrepidInvestigator);
    // Should have base lore when no other characters with strength 5+
    expect(elisaInPlay?.lore).toBe(elisaMazaIntrepidInvestigator.lore);
  });

  it("SPECIAL DETAIL - Gets no bonus when alone", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elisaMazaIntrepidInvestigator],
        inkwell: elisaMazaIntrepidInvestigator.cost,
      },
      {
        hand: [],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(elisaMazaIntrepidInvestigator),
    ).toBeSuccessfulCommand();

    const elisaInPlay = testEngine.asPlayerOne().getCard(elisaMazaIntrepidInvestigator);
    // Should have base lore when no other characters in play
    expect(elisaInPlay?.lore).toBe(elisaMazaIntrepidInvestigator.lore);
  });

  it("should have SPECIAL DETAIL ability defined", () => {
    const ability = elisaMazaIntrepidInvestigator.abilities?.find((a) => a.type === "static");
    expect(ability).toBeDefined();
    expect(ability?.type).toBe("static");
  });
});
