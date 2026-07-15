import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { cursedMerfolkUrsulasHandiwork } from "../../003/characters/070-cursed-merfolk-ursulas-handiwork";
import { grumpySkepticalKnight } from "./186-grumpy-skeptical-knight";
import { happyLivelyKnight } from "./191-happy-lively-knight";

const groundedAttacker = createMockCharacter({
  id: "grumpy-grounded-attacker",
  name: "Grounded Attacker",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const evasiveDefender = createMockCharacter({
  id: "grumpy-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
  abilities: [{ type: "keyword", keyword: "Evasive", text: "Evasive", id: "grumpy-evasive" }],
});

const neutralLocation = createMockLocation({
  id: "grumpy-neutral-location",
  name: "Neutral Location",
  cost: 2,
  moveCost: 1,
  willpower: 8,
  lore: 1,
});

describe("Grumpy - Skeptical Knight", () => {
  it("grants Resist +2 only to your Knight characters at a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: grumpySkepticalKnight, isDrying: false },
          { card: happyLivelyKnight, atLocation: neutralLocation, exerted: true },
          { card: cursedMerfolkUrsulasHandiwork, atLocation: neutralLocation },
          neutralLocation,
        ],
        inkwell: neutralLocation.moveCost,
        deck: 1,
      },
      {
        play: [{ card: groundedAttacker, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(happyLivelyKnight, "Resist")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(grumpySkepticalKnight, "Resist")).toBe(false);
    expect(testEngine.asPlayerOne().hasKeyword(cursedMerfolkUrsulasHandiwork, "Resist")).toBe(
      false,
    );

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(grumpySkepticalKnight, neutralLocation),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(grumpySkepticalKnight, "Resist")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(groundedAttacker, happyLivelyKnight),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(happyLivelyKnight)).toBe("play");
    expect(testEngine.asPlayerOne().getDamage(happyLivelyKnight)).toBe(0);
  });

  it("gains Evasive during your turn but not during your opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: grumpySkepticalKnight, isDrying: false }],
        deck: 1,
      },
      {
        play: [
          { card: evasiveDefender, exerted: true, isDrying: false },
          { card: groundedAttacker, isDrying: false },
        ],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(grumpySkepticalKnight, evasiveDefender)).toBe(
      true,
    );

    expect(testEngine.asServer().manualExertCard(grumpySkepticalKnight)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().canChallenge(groundedAttacker, grumpySkepticalKnight)).toBe(
      true,
    );
  });
});
