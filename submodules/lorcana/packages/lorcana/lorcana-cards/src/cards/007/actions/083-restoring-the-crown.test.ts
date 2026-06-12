import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  edgarBalthazarAmbitiousButler,
  madHatterUnrulyEccentric,
  petePirateScoundrel,
  scroogeMcduckResourcefulMiser,
  yokaiIntellectualSchemer,
} from "../../007";
import { restoringTheCrown } from "./083-restoring-the-crown";

describe("Restoring the Crown", () => {
  it("exerts all opposing characters and grants lore when your characters win challenges this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [restoringTheCrown],
        inkwell: restoringTheCrown.cost,
        play: [edgarBalthazarAmbitiousButler, scroogeMcduckResourcefulMiser],
      },
      {
        play: [petePirateScoundrel, madHatterUnrulyEccentric, yokaiIntellectualSchemer],
      },
    );

    expect(testEngine.asPlayerOne().playCard(restoringTheCrown)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCard(petePirateScoundrel)?.exerted).toBe(true);
    expect(testEngine.asPlayerTwo().getCard(madHatterUnrulyEccentric)?.exerted).toBe(true);
    expect(testEngine.asPlayerTwo().getCard(yokaiIntellectualSchemer)?.exerted).toBe(true);

    expect(
      testEngine.asPlayerOne().challenge(edgarBalthazarAmbitiousButler, petePirateScoundrel)
        .success,
    ).toBe(true);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);

    expect(
      testEngine.asPlayerOne().challenge(scroogeMcduckResourcefulMiser, yokaiIntellectualSchemer)
        .success,
    ).toBe(true);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(4);
  });
});
