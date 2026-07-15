import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { liloJuniorCakeDecorator } from "../characters/008-lilo-junior-cake-decorator";
import { hypnoticStrength } from "./059-hypnotic-strength";

describe("Hypnotic Strength", () => {
  it("draws a card and gives the chosen character Challenger +2 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hypnoticStrength],
      inkwell: hypnoticStrength.cost,
      play: [liloJuniorCakeDecorator],
      deck: [simbaProtectiveCub],
    });

    expect(testEngine.getKeywordValue(liloJuniorCakeDecorator, "Challenger")).toBeNull();
    expect(
      testEngine.asPlayerOne().playCardTo(hypnoticStrength, liloJuniorCakeDecorator).success,
    ).toBe(true);

    expect(testEngine.getKeywordValue(liloJuniorCakeDecorator, "Challenger")).toBe(2);
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });
});
