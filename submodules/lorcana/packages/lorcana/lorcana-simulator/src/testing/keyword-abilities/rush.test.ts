import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mauiHeroToAll, stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { rushAttacker } from "../rules/section-08-test-utils";

describe("Rush - Rush (This character can challenge the turn they're played.)", () => {
  it("Rush lets a character challenge the turn it's played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rushAttacker],
        inkwell: rushAttacker.cost,
      },
      {
        play: [{ card: stitchNewDog, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(rushAttacker)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().challenge(rushAttacker, stitchNewDog)).toBeSuccessfulCommand();
  });

  it("Rush+Reckless character can challenge the turn it's played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mauiHeroToAll],
        inkwell: mauiHeroToAll.cost,
      },
      {
        play: [{ card: stitchNewDog, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(mauiHeroToAll)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().challenge(mauiHeroToAll, stitchNewDog)).toBeSuccessfulCommand();
  });
});
