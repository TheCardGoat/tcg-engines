import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { fairyGodmothersWand } from "../../010/items/168-fairy-godmothers-wand";
import { heWhoStealsAndRunsAway } from "./114-he-who-steals-and-runs-away";

describe("He Who Steals and Runs Away", () => {
  it("banishes the chosen item and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heWhoStealsAndRunsAway],
        inkwell: heWhoStealsAndRunsAway.cost,
        deck: [simbaProtectiveCub],
      },
      {
        play: [fairyGodmothersWand],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(heWhoStealsAndRunsAway, {
        targets: [fairyGodmothersWand],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(fairyGodmothersWand)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});
