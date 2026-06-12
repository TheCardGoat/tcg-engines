import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { theFrozenVineMonstrousPlant } from "../locations/068-the-frozen-vine-monstrous-plant";
import { scroogesCountingHouseEbenezersOffice } from "../locations/134-scrooges-counting-house-ebenezers-office";
import { elsaConcernedSisterEpic } from "./215-elsa-concerned-sister-epic";

describe("Elsa - Concerned Sister (Epic)", () => {
  it("CLEAR THE WAY - reduces cost of next location by 2 when Elsa is played", () => {
    // theFrozenVineMonstrousPlant costs 3; with -2 reduction it should cost 1
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: elsaConcernedSisterEpic.cost + 1, // 3 for Elsa + 1 for reduced location (normally costs 3)
      hand: [elsaConcernedSisterEpic, theFrozenVineMonstrousPlant],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(elsaConcernedSisterEpic)).toBeSuccessfulCommand();
    // After playing Elsa (cost 3), 1 ink remains
    // The Frozen Vine normally costs 3, but with -2 it costs 1 → exactly affordable
    expect(testEngine.asPlayerOne().playCard(theFrozenVineMonstrousPlant)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(theFrozenVineMonstrousPlant)).toBe("play");
  });

  it("CLEAR THE WAY - enables playing a location that was previously unaffordable", () => {
    // Without reduction, the location is unaffordable; after playing Elsa it becomes affordable
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: elsaConcernedSisterEpic.cost + 1, // only 1 ink left after Elsa
      hand: [elsaConcernedSisterEpic, theFrozenVineMonstrousPlant],
      deck: 2,
    });

    // Play Elsa: triggers CLEAR THE WAY, granting -2 on next location
    expect(testEngine.asPlayerOne().playCard(elsaConcernedSisterEpic)).toBeSuccessfulCommand();

    // The Frozen Vine costs 3, but with -2 reduction it becomes 1 — we have exactly 1 ink
    expect(testEngine.asPlayerOne().canPlayCard(theFrozenVineMonstrousPlant)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(theFrozenVineMonstrousPlant)).toBeSuccessfulCommand();
  });

  it("CLEAR THE WAY - only reduces cost for the next location played, not subsequent ones", () => {
    // scroogesCountingHouseEbenezersOffice costs 2; with -2 reduction it costs 0
    // After first location is played, reduction is consumed
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: elsaConcernedSisterEpic.cost + scroogesCountingHouseEbenezersOffice.cost,
      hand: [
        elsaConcernedSisterEpic,
        scroogesCountingHouseEbenezersOffice,
        scroogesCountingHouseEbenezersOffice,
      ],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(elsaConcernedSisterEpic)).toBeSuccessfulCommand();
    // First location is free (2 - 2 = 0), uses all remaining ink (2)
    expect(
      testEngine.asPlayerOne().playCard(scroogesCountingHouseEbenezersOffice),
    ).toBeSuccessfulCommand();
    // Second location should NOT get reduction - not enough ink (0 remaining, needs 2)
    expect(testEngine.asPlayerOne().canPlayCard(scroogesCountingHouseEbenezersOffice)).toBe(false);
  });

  it("CLEAR THE WAY - reduction does not apply to characters", () => {
    // Only locations get the discount
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: elsaConcernedSisterEpic.cost,
      hand: [elsaConcernedSisterEpic, elsaConcernedSisterEpic],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(elsaConcernedSisterEpic)).toBeSuccessfulCommand();
    // Second Elsa costs 3, but we have 0 ink left — reduction should NOT apply to characters
    expect(testEngine.asPlayerOne().canPlayCard(elsaConcernedSisterEpic)).toBe(false);
  });
});
