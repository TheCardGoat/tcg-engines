import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseAmberChampion } from "./010/characters/023-mickey-mouse-amber-champion";
import { shantiVillageGirl } from "./010/characters/013-shanti-village-girl";
import { gazelleBalladSinger } from "./010/characters/025-gazelle-ballad-singer";
import { oneLastHope } from "./004/actions/197-one-last-hope";
import { moanaChosenByTheOcean } from "./001/characters/117-moana-chosen-by-the-ocean";
import { daleReadyForHisShot } from "./012/characters/022-dale-ready-for-his-shot";
import { svenLeapingReindeer } from "./011/characters/060-sven-leaping-reindeer";

// ========== REPRO #12: Mickey Mouse Amber Champion Singer 8 ==========
describe("REPRO #12: Mickey Mouse - Amber Champion Singer 8", () => {
  it("should have Singer value 8 with 2+ other Amber characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mickeyMouseAmberChampion, shantiVillageGirl, gazelleBalladSinger],
    });
    expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseAmberChampion, "Singer")).toBe(true);
    expect(testEngine.asPlayerOne().getKeywordValue(mickeyMouseAmberChampion, "Singer")).toBe(8);
  });

  it("should allow singing cost-8 song after passing turn and coming back", () => {
    const expensiveSong = createMockSong({
      id: "repro-expensive-song",
      name: "Expensive Song",
      cost: 8,
      text: "A cost 8 song.",
      abilities: [],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: mickeyMouseAmberChampion, isDrying: false },
          shantiVillageGirl,
          gazelleBalladSinger,
        ],
        hand: [expensiveSong],
        inkwell: 0,
        deck: 5,
      },
      { deck: 5 },
    );

    // Pass to opponent and back to player one
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Now on player one's turn again
    expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseAmberChampion, "Singer")).toBe(true);
    expect(testEngine.asPlayerOne().getKeywordValue(mickeyMouseAmberChampion, "Singer")).toBe(8);

    const songId = testEngine.findCardInstanceId(expensiveSong, "hand", PLAYER_ONE);
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseAmberChampion, "play", PLAYER_ONE);

    expect(testEngine.asPlayerOne().getMoveOptions("singCard", songId)).toEqual([
      { kind: "card", cardId: mickeyId },
    ]);

    expect(
      testEngine.asPlayerOne().singSong(expensiveSong, mickeyMouseAmberChampion),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(expensiveSong)).toBe("discard");
  });
});

// ========== REPRO #14: One Last Hope resist across opponent turn ==========
describe("REPRO #14: One Last Hope resist persists through opponent turn", () => {
  it("Resist +2 should reduce damage when challenged on opponent's turn", () => {
    const opponentAttacker = createMockCharacter({
      id: "repro-attacker",
      name: "Attacker",
      cost: 3,
      strength: 5,
      willpower: 5,
      lore: 1,
      inkable: true,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [oneLastHope],
        inkwell: oneLastHope.cost,
        play: [{ card: moanaChosenByTheOcean, exerted: true }],
        deck: 5,
      },
      {
        play: [{ card: opponentAttacker, isDrying: false }],
        deck: 5,
      },
    );

    // Play One Last Hope on Moana
    expect(
      testEngine.asPlayerOne().playCard(oneLastHope, { targets: [moanaChosenByTheOcean] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(moanaChosenByTheOcean, "Resist")).toBe(2);

    // Pass to opponent
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges exerted Moana on their turn
    expect(
      testEngine.asPlayerTwo().challenge(opponentAttacker, moanaChosenByTheOcean),
    ).toBeSuccessfulCommand();

    // Moana has willpower 5, Resist 2, attacker deals 5 damage
    // With Resist 2, she should take only 3 damage and survive
    expect(testEngine.asPlayerOne().getDamage(moanaChosenByTheOcean)).toBe(3);
    expect(testEngine.asPlayerOne().getCardZone(moanaChosenByTheOcean)).toBe("play");
  });
});

// ========== REPRO #7: Dale + Sven Challenger damage ==========
describe("REPRO #7: Dale + Sven Challenger damage", () => {
  it("Sven with Dale should deal willpower (3) not strength+challenger (5)", () => {
    const defender = createMockCharacter({
      id: "repro-defender",
      name: "Defender",
      cost: 5,
      strength: 2,
      willpower: 10,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: daleReadyForHisShot, isDrying: false },
          { card: svenLeapingReindeer, isDrying: false },
        ],
        deck: 5,
      },
      {
        play: [{ card: defender, exerted: true }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().getKeywordValue(svenLeapingReindeer, "Challenger")).toBe(3);
    expect(testEngine.asPlayerOne().getCardStrength(svenLeapingReindeer)).toBe(2); // base strength, challenger is separate
    expect(testEngine.asPlayerOne().getCard(svenLeapingReindeer).willpower).toBe(3);

    expect(
      testEngine.asPlayerOne().challenge(svenLeapingReindeer, defender),
    ).toBeSuccessfulCommand();

    // Under Dale, damage should be willpower (3), NOT strength+challenger (5)
    expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(3);
  });
});
