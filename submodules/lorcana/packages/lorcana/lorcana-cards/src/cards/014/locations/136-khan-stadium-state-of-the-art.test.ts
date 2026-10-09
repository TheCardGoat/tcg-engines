// CR 2.2.0: 4.7.1–4.7.4 (movement and costs), 6.1.13.5 (while here),
// 6.4.1 (continuous static effects), 4.6.8 (challenge damage).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { khanStadiumStateOfTheArt } from "./136-khan-stadium-state-of-the-art";

const athlete = createMockCharacter({
  id: "khan-stadium-athlete",
  name: "Khan Stadium Athlete",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const benchwarmer = createMockCharacter({
  id: "khan-stadium-benchwarmer",
  name: "Khan Stadium Benchwarmer",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const otherLocation = createMockLocation({
  id: "khan-stadium-other-location",
  name: "Khan Stadium Other Location",
  cost: 1,
  moveCost: 1,
});

describe("Khan Stadium - State of the Art", () => {
  it("a replacement copy does not inherit occupants of the banished Stadium", () => {
    const attacker = createMockCharacter({
      id: "khan-replacement-attacker",
      name: "Replacement Attacker",
      cost: 1,
      strength: 4,
      willpower: 4,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [khanStadiumStateOfTheArt],
        play: [khanStadiumStateOfTheArt, { card: athlete, atLocation: khanStadiumStateOfTheArt }],
        inkwell: 2,
        deck: 3,
      },
      { play: [{ card: attacker, isDrying: false }], deck: 3 },
    );
    const old = g.findCardInstanceId(khanStadiumStateOfTheArt, "play", PLAYER_ONE);
    const replacement = g.findCardInstanceId(khanStadiumStateOfTheArt, "hand", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(attacker, old)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(replacement)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(old)).toBe("discard");
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
    expect(g.asPlayerOne().moveCharacterToLocation(athlete, replacement)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
  });

  it("does not charge or stack the bonus when moving to the same location again", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [khanStadiumStateOfTheArt, athlete],
      inkwell: 2,
    });
    expect(
      g.asPlayerOne().moveCharacterToLocation(athlete, khanStadiumStateOfTheArt),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().moveCharacterToLocation(athlete, khanStadiumStateOfTheArt),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
  });

  it("the Strength bonus applies to Ward but changes neither lore nor willpower", () => {
    const ward = createMockCharacter({
      id: "khan-ward",
      name: "Ward Guest",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 2,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [khanStadiumStateOfTheArt, { card: ward, isDrying: false }],
      inkwell: 1,
    });
    expect(
      g.asPlayerOne().moveCharacterToLocation(ward, khanStadiumStateOfTheArt),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(ward)).toBe(4);
    expect(g.asPlayerOne().getCard(ward)?.willpower).toBe(3);
    expect(g.asPlayerOne().getCardLore(ward)).toBe(2);
    expect(g.asPlayerOne().quest(ward)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });

  it("updates Strength immediately on entry, departure and return", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [khanStadiumStateOfTheArt, otherLocation, { card: athlete, isDrying: false }],
      inkwell: 3,
    });
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
    expect(
      g.asPlayerOne().moveCharacterToLocation(athlete, khanStadiumStateOfTheArt),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().moveCharacterToLocation(athlete, otherLocation)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
    expect(
      g.asPlayerOne().moveCharacterToLocation(athlete, khanStadiumStateOfTheArt),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("does not apply the bonus when movement cannot be paid", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [khanStadiumStateOfTheArt, athlete],
    });
    expect(
      g.asPlayerOne().moveCharacterToLocation(athlete, khanStadiumStateOfTheArt),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  for (const exerted of [false, true])
    it("can move a drying character with exerted state " + exerted, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [khanStadiumStateOfTheArt, { card: athlete, exerted, isDrying: true }],
        inkwell: 1,
      });
      expect(
        g.asPlayerOne().moveCharacterToLocation(athlete, khanStadiumStateOfTheArt),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
      expect(g.asPlayerOne().isExerted(athlete)).toBe(exerted);
      expect(g.asPlayerOne().quest(athlete)).not.toBeSuccessfulCommand();
    });

  it("does not stack bonuses from separate copies of the same location", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [khanStadiumStateOfTheArt, khanStadiumStateOfTheArt, athlete],
      inkwell: 2,
    });
    const [first, second] = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(g.asPlayerOne().moveCharacterToLocation(athlete, first)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
    expect(g.asPlayerOne().moveCharacterToLocation(athlete, second)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("boosts every character here without changing other characters", () => {
    const outsider = createMockCharacter({
      id: "khan-outsider",
      name: "Outsider",
      cost: 1,
      strength: 5,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        khanStadiumStateOfTheArt,
        { card: athlete, atLocation: khanStadiumStateOfTheArt },
        { card: benchwarmer, atLocation: khanStadiumStateOfTheArt },
        outsider,
      ],
    });
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
    expect(g.asPlayerOne().getCardStrength(benchwarmer)).toBe(4);
    expect(g.asPlayerOne().getCardStrength(outsider)).toBe(5);
  });

  it("each player's Stadium affects only its own occupants", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [khanStadiumStateOfTheArt, athlete] },
      {
        play: [
          khanStadiumStateOfTheArt,
          otherLocation,
          { card: benchwarmer, atLocation: khanStadiumStateOfTheArt },
        ],
        inkwell: 1,
      },
    );
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
    expect(g.asPlayerTwo().getCardStrength(benchwarmer)).toBe(4);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().moveCharacterToLocation(benchwarmer, otherLocation),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(benchwarmer)).toBe(2);
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
  });

  it("rejects movement to an opposing location or of an opposing character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [khanStadiumStateOfTheArt, athlete], inkwell: 2 },
      { play: [khanStadiumStateOfTheArt, benchwarmer] },
    );
    const enemyStadium = g.findCardInstanceId(khanStadiumStateOfTheArt, "play", PLAYER_TWO);
    const ownStadium = g.findCardInstanceId(khanStadiumStateOfTheArt, "play", PLAYER_ONE);
    expect(
      g.asPlayerOne().moveCharacterToLocation(athlete, enemyStadium),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().moveCharacterToLocation(benchwarmer, ownStadium),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
    expect(g.asPlayerTwo().getCardStrength(benchwarmer)).toBe(2);
  });

  it("the bonus changes actual challenge damage", () => {
    const defender = createMockCharacter({
      id: "khan-defender",
      name: "Defender",
      cost: 1,
      strength: 1,
      willpower: 4,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [khanStadiumStateOfTheArt, { card: athlete, isDrying: false }], inkwell: 1 },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(
      g.asPlayerOne().moveCharacterToLocation(athlete, khanStadiumStateOfTheArt),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(athlete, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(defender)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(athlete)).toBe("play");
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
  });

  it("loses the bonus when Stadium is banished and remains in play", () => {
    const attacker = createMockCharacter({
      id: "khan-demolisher",
      name: "Demolisher",
      cost: 1,
      strength: 4,
      willpower: 4,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [khanStadiumStateOfTheArt, { card: athlete, atLocation: khanStadiumStateOfTheArt }],
        deck: 3,
      },
      { play: [{ card: attacker, isDrying: false }], deck: 3 },
    );
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(attacker, khanStadiumStateOfTheArt)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(khanStadiumStateOfTheArt)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(athlete)).toBe("play");
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
  });

  it("can play for one ink and immediately move a character here for one more", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanStadiumStateOfTheArt],
      play: [athlete],
      inkwell: 2,
    });
    expect(g.asPlayerOne().playCard(khanStadiumStateOfTheArt)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
    expect(
      g.asPlayerOne().moveCharacterToLocation(athlete, khanStadiumStateOfTheArt),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(4);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("cannot play without ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [khanStadiumStateOfTheArt] });
    expect(g.asPlayerOne().playCard(khanStadiumStateOfTheArt)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(khanStadiumStateOfTheArt)).toBe("hand");
  });

  it("can be inked and provides neither the bonus nor location lore from the inkwell", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [khanStadiumStateOfTheArt], play: [athlete], deck: 3 },
      { deck: 3 },
    );
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, khanStadiumStateOfTheArt),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(khanStadiumStateOfTheArt)).toBe("inkwell");
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardStrength(athlete)).toBe(2);
  });

  it("gains one location lore at its own Set step without occupants", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [khanStadiumStateOfTheArt], deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });

  it("Big Show - characters here get +2 {S}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        khanStadiumStateOfTheArt,
        { card: athlete, atLocation: khanStadiumStateOfTheArt },
        benchwarmer,
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(athlete)?.strength).toBe(athlete.strength + 2);
    expect(testEngine.asPlayerOne().getCard(benchwarmer)?.strength).toBe(benchwarmer.strength);
  });

  it("Big Show - characters at another location are not boosted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [khanStadiumStateOfTheArt, otherLocation, { card: athlete, atLocation: otherLocation }],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(athlete)?.strength).toBe(athlete.strength);
  });
});
