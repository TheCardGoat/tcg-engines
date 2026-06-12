import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { scroogesCountingHouseEbenezersOffice } from "../locations/134-scrooges-counting-house-ebenezers-office";
import { elsaConcernedSister } from "./125-elsa-concerned-sister";

describe("Elsa - Concerned Sister", () => {
  it("CLEAR THE WAY - reduces the cost of the next location you play this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [elsaConcernedSister, scroogesCountingHouseEbenezersOffice],
      inkwell: elsaConcernedSister.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(elsaConcernedSister)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(elsaConcernedSister)).toBe("play");
    expect(testEngine.asPlayerOne().canPlayCard(scroogesCountingHouseEbenezersOffice)).toBe(true);
    expect(
      testEngine.asPlayerOne().playCard(scroogesCountingHouseEbenezersOffice),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(scroogesCountingHouseEbenezersOffice)).toBe("play");
  });
});
