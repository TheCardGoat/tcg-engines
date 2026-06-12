import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { moanaKakamoraLeader } from "./121-moana-kakamora-leader";
import { kakamoraLongrangeSpecialist } from "./171-kakamora-long-range-specialist";
import { kakamoraPiratePitcher } from "./105-kakamora-pirate-pitcher";
import { kakamoraBoardingParty } from "./104-kakamora-boarding-party";
import { flotillaCoconutArmada } from "../locations/135-flotilla-coconut-armada";

describe("Moana - Kakamora Leader", () => {
  it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Moana.)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [moanaKakamoraLeader],
    });

    expect(testEngine.asPlayerOne().hasKeyword(moanaKakamoraLeader, "Shift")).toBe(true);
  });

  it("GATHERING FORCES - moves characters to a location and gains 1 lore per character moved", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: moanaKakamoraLeader.cost,
      hand: [moanaKakamoraLeader],
      play: [
        kakamoraLongrangeSpecialist,
        kakamoraPiratePitcher,
        kakamoraBoardingParty,
        flotillaCoconutArmada,
      ],
    });

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    // Play Moana - triggers GATHERING FORCES
    expect(testEngine.asPlayerOne().playCard(moanaKakamoraLeader)).toBeSuccessfulCommand();

    // Accept optional ability and choose characters to move + location
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(moanaKakamoraLeader, {
        resolveOptional: true,
        targets: [
          kakamoraLongrangeSpecialist,
          kakamoraPiratePitcher,
          kakamoraBoardingParty,
          moanaKakamoraLeader,
          flotillaCoconutArmada,
        ],
      }),
    ).toBeSuccessfulCommand();

    // 4 characters moved = 4 lore gained
    expect(testEngine.getLore(PLAYER_ONE)).toBe(4);

    // All 4 characters should be at the location
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: kakamoraLongrangeSpecialist,
      location: flotillaCoconutArmada,
    });
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: kakamoraPiratePitcher,
      location: flotillaCoconutArmada,
    });
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: kakamoraBoardingParty,
      location: flotillaCoconutArmada,
    });
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: moanaKakamoraLeader,
      location: flotillaCoconutArmada,
    });
  });

  it("GATHERING FORCES - moves only a subset of characters and gains lore equal to moved count", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: moanaKakamoraLeader.cost,
      hand: [moanaKakamoraLeader],
      play: [
        kakamoraBoardingParty,
        kakamoraPiratePitcher,
        kakamoraLongrangeSpecialist,
        flotillaCoconutArmada,
      ],
    });

    expect(testEngine.asPlayerOne().playCard(moanaKakamoraLeader)).toBeSuccessfulCommand();

    // Move only 2 of the 4 available characters.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(moanaKakamoraLeader, {
        resolveOptional: true,
        targets: [kakamoraBoardingParty, kakamoraPiratePitcher, flotillaCoconutArmada],
      }),
    ).toBeSuccessfulCommand();

    // 2 characters moved = 2 lore gained (not 4).
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: kakamoraBoardingParty,
      location: flotillaCoconutArmada,
    });
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: kakamoraPiratePitcher,
      location: flotillaCoconutArmada,
    });
  });

  it("GATHERING FORCES - optional: declining does not move characters or gain lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: moanaKakamoraLeader.cost,
      hand: [moanaKakamoraLeader],
      play: [kakamoraBoardingParty, flotillaCoconutArmada],
    });

    // Play Moana - triggers GATHERING FORCES
    expect(testEngine.asPlayerOne().playCard(moanaKakamoraLeader)).toBeSuccessfulCommand();

    // Decline the optional ability
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(moanaKakamoraLeader, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
