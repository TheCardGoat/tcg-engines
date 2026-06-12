import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack } from "../../001";
import { gastonArrogantHunter } from "../../001/characters/110-gaston-arrogant-hunter";
import { aladdinBarrelingThroughEpic } from "./216-aladdin-barreling-through-epic";

describe("Aladdin - Barreling Through (Epic)", () => {
  it("has correct stats", () => {
    expect(aladdinBarrelingThroughEpic.cost).toBe(3);
    expect(aladdinBarrelingThroughEpic.strength).toBe(4);
    expect(aladdinBarrelingThroughEpic.willpower).toBe(4);
    expect(aladdinBarrelingThroughEpic.lore).toBe(0);
    expect(aladdinBarrelingThroughEpic.inkable).toBe(true);
    expect(aladdinBarrelingThroughEpic.classifications).toEqual(["Storyborn", "Hero", "Whisper"]);
  });

  it("has Boost 1 keyword", () => {
    const boostAbility = aladdinBarrelingThroughEpic.abilities?.find(
      (a) => a.type === "keyword" && a.keyword === "Boost",
    );
    expect(boostAbility).toBeDefined();
    expect(
      boostAbility?.type === "keyword" && "value" in boostAbility ? boostAbility.value : undefined,
    ).toBe(1);
  });

  it("has Reckless keyword", () => {
    const recklessAbility = aladdinBarrelingThroughEpic.abilities?.find(
      (a) => a.type === "keyword" && a.keyword === "Reckless",
    );
    expect(recklessAbility).toBeDefined();
  });

  describe("ONLY THE BOLD", () => {
    it("Aladdin can activate Boost to put a card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinBarrelingThroughEpic],
        inkwell: [heiheiBoatSnack],
        deck: 10,
      });

      // Activate Boost ability (costs 1 ink)
      const result = testEngine
        .asPlayerOne()
        .activateAbility(aladdinBarrelingThroughEpic, { ability: "Boost 1" });
      expect(result).toBeSuccessfulCommand();

      // Should now have a card under Aladdin
      const cardsUnder = testEngine.getCardsUnder(aladdinBarrelingThroughEpic);
      expect(cardsUnder.length).toBe(1);
    });

    it("Aladdin gains the exert-for-lore ability after boosting", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinBarrelingThroughEpic],
        inkwell: [heiheiBoatSnack],
        deck: 10,
      });

      // Activate Boost ability
      const boostResult = testEngine
        .asPlayerOne()
        .activateAbility(aladdinBarrelingThroughEpic, { ability: "Boost 1" });
      expect(boostResult).toBeSuccessfulCommand();

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Activate ONLY THE BOLD ability (exert to gain 1 lore)
      const abilityResult = testEngine.asPlayerOne().activateAbility(aladdinBarrelingThroughEpic, {
        ability: "ONLY THE BOLD",
      });
      expect(abilityResult).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
      expect(testEngine.isExerted(aladdinBarrelingThroughEpic)).toBe(true);
    });

    it("Aladdin cannot use the exert-for-lore ability before boosting (no card under)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinBarrelingThroughEpic],
        deck: 10,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Try to activate ONLY THE BOLD without a card under
      const result = testEngine.asPlayerOne().activateAbility(aladdinBarrelingThroughEpic, {
        ability: "ONLY THE BOLD",
      });
      expect(result).not.toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("other characters with Reckless also gain the exert-for-lore ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinBarrelingThroughEpic, gastonArrogantHunter],
        inkwell: [heiheiBoatSnack],
        deck: 10,
      });

      // Activate Boost on Aladdin
      const boostResult = testEngine
        .asPlayerOne()
        .activateAbility(aladdinBarrelingThroughEpic, { ability: "Boost 1" });
      expect(boostResult).toBeSuccessfulCommand();

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Gaston has Reckless, so he should gain the ONLY THE BOLD ability
      const gastonResult = testEngine
        .asPlayerOne()
        .activateAbility(gastonArrogantHunter, { ability: "ONLY THE BOLD" });
      expect(gastonResult).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
      expect(testEngine.isExerted(gastonArrogantHunter)).toBe(true);
    });

    it("characters without Reckless do not gain the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinBarrelingThroughEpic, heiheiBoatSnack],
        inkwell: [heiheiBoatSnack],
        deck: 10,
      });

      // Activate Boost on Aladdin
      const boostResult = testEngine
        .asPlayerOne()
        .activateAbility(aladdinBarrelingThroughEpic, { ability: "Boost 1" });
      expect(boostResult).toBeSuccessfulCommand();

      // HeiHei does NOT have Reckless, so it should not gain the ability
      const heiheiResult = testEngine
        .asPlayerOne()
        .activateAbility(heiheiBoatSnack, { ability: "ONLY THE BOLD" });
      expect(heiheiResult).not.toBeSuccessfulCommand();
    });
  });
});
