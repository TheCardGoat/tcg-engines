import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { peterPansShadowNotSewnOn } from "../../002";
import { peteBornToCheat } from "../../004";
import { petePastryChomper } from "../characters";
import { blastFromYourPast } from "./028-blast-from-your-past";

describe("Blast from Your Past", () => {
  it("names a card and returns all character cards with that name from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [blastFromYourPast],
      inkwell: blastFromYourPast.cost,
      discard: [petePastryChomper, peteBornToCheat, peterPansShadowNotSewnOn],
    });

    expect(testEngine.asPlayerOne().playCard(blastFromYourPast)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(blastFromYourPast, {
        namedCard: "Pete",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(petePastryChomper)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(peteBornToCheat)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(peterPansShadowNotSewnOn)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, discard: 2 });
  });
});
