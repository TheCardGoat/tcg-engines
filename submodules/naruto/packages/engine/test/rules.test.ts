import { describe, expect, it } from "vitest";

import { CONFIRMED_STRUCTURAL_RULES, NARUTO_RULES_SOURCE, PROVISIONAL_RULES } from "../src/rules";

describe("rules provenance boundary", () => {
  it("limits confirmed fields to facts mapped to the official welcome page", () => {
    expect(CONFIRMED_STRUCTURAL_RULES).toEqual({
      totalDeckSize: 51,
      chakraCount: 5,
      summonCount: 1,
      cardTypes: ["leader", "character", "ex_character", "chakra", "summon"],
      charactersChosenByLeaderColor: true,
      exCharactersRequireConditions: true,
      summonRestsToDeploy: true,
      chakraActivatesFaceDownSupports: true,
      leaderLifeZeroLoses: true,
    });
  });

  it("records the exact reviewed response and keeps the 50-card model provisional", () => {
    expect(NARUTO_RULES_SOURCE).toMatchObject({
      url: "https://www.naruto-cardgame.com/en/welcome/",
      accessedOn: "2026-08-02",
      reviewedContentSha256: "57a0c49dd8b06f9f98067121da7209edbebf4ef0eaeb2ddcaba729ee177c5ec0",
      evidenceManifest: "packages/cards/card-source-manifest.json",
    });
    expect(PROVISIONAL_RULES.mainDeckSize).toBe(50);
    expect("mainDeckSize" in CONFIRMED_STRUCTURAL_RULES).toBe(false);
  });
});
