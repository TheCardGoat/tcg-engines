import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { iagoPrettyPolly } from "../../003/characters";
import { simbaScrappyCub } from "../../003/characters";
import { dumboNinthWonderOfTheUniverse } from "./045-dumbo-ninth-wonder-of-the-universe";

describe("Dumbo - Ninth Wonder of the Universe (set9-045)", () => {
  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [dumboNinthWonderOfTheUniverse],
    });

    expect(testEngine.asPlayerOne().getCard(dumboNinthWonderOfTheUniverse)?.keywords).toContain(
      "Evasive",
    );
  });

  it("BREAKING RECORDS: exert + 1 ink to draw a card and gain 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [dumboNinthWonderOfTheUniverse],
      deck: 3,
    });

    const result = testEngine.asPlayerOne().activateAbility(dumboNinthWonderOfTheUniverse, {
      ability: "BREAKING RECORDS",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(dumboNinthWonderOfTheUniverse)).toBe(true);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1 });
  });

  it("MAKING HISTORY: grants BREAKING RECORDS to other characters with Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [dumboNinthWonderOfTheUniverse, iagoPrettyPolly],
      deck: 3,
    });

    // Iago has Evasive, so it should gain the BREAKING RECORDS activated ability
    const result = testEngine.asPlayerOne().activateAbility(iagoPrettyPolly, {
      ability: "BREAKING RECORDS",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(iagoPrettyPolly)).toBe(true);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1 });
  });

  it("MAKING HISTORY: does NOT grant ability to characters without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [dumboNinthWonderOfTheUniverse, simbaScrappyCub],
      deck: 3,
    });

    // Simba does not have Evasive, so should not have BREAKING RECORDS
    const result = testEngine.asPlayerOne().activateAbility(simbaScrappyCub, {
      ability: "BREAKING RECORDS",
    });

    expect(result).not.toBeSuccessfulCommand();
  });

  it("MAKING HISTORY: Dumbo does not grant himself a duplicate BREAKING RECORDS", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [dumboNinthWonderOfTheUniverse],
      deck: 3,
    });

    // Activate BREAKING RECORDS (Dumbo's own)
    const result = testEngine.asPlayerOne().activateAbility(dumboNinthWonderOfTheUniverse, {
      ability: "BREAKING RECORDS",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(dumboNinthWonderOfTheUniverse)).toBe(true);
    // Since Dumbo is exerted and only has 1 BREAKING RECORDS, he can't activate again
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1 });
  });
});
