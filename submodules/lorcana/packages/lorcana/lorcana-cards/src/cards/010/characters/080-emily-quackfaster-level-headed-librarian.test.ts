import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaKingInTheMaking } from "./020-simba-king-in-the-making";
import { emilyQuackfasterLevelheadedLibrarian } from "./080-emily-quackfaster-level-headed-librarian";
import { scroogesCountingHouseEbenezersOffice } from "../../011/locations/134-scrooges-counting-house-ebenezers-office";

describe("Emily Quackfaster - Level-Headed Librarian", () => {
  it("may put the top card of your deck under a chosen character with Boost when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [scroogesCountingHouseEbenezersOffice],
      hand: [emilyQuackfasterLevelheadedLibrarian],
      inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
      play: [simbaKingInTheMaking],
    });

    const storedCardId = testEngine.findCardInstanceId(
      scroogesCountingHouseEbenezersOffice,
      "deck",
      "p1",
    );

    expect(
      testEngine.asPlayerOne().playCard(emilyQuackfasterLevelheadedLibrarian),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(emilyQuackfasterLevelheadedLibrarian, {
        resolveOptional: true,
        targets: [simbaKingInTheMaking],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardsUnder(simbaKingInTheMaking)).toEqual([storedCardId]);
  });

  it("may put the top card of your deck under a chosen location with Boost when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [simbaKingInTheMaking],
      hand: [emilyQuackfasterLevelheadedLibrarian],
      inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
      play: [scroogesCountingHouseEbenezersOffice],
    });

    const storedCardId = testEngine.findCardInstanceId(simbaKingInTheMaking, "deck", "p1");

    expect(
      testEngine.asPlayerOne().playCard(emilyQuackfasterLevelheadedLibrarian),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(emilyQuackfasterLevelheadedLibrarian, {
        resolveOptional: true,
        targets: [scroogesCountingHouseEbenezersOffice],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardsUnder(scroogesCountingHouseEbenezersOffice)).toEqual([storedCardId]);
  });
});
