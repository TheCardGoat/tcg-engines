import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { mauiSoaringDemigod } from "../characters";
import { divebomb } from "./128-divebomb";

describe("Divebomb", () => {
  it("banishes one of your reckless characters to banish a weaker chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [divebomb],
        inkwell: divebomb.cost,
        play: [mauiSoaringDemigod],
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(divebomb, {
        targets: [mauiSoaringDemigod],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    const [pendingEffect] = testEngine.asPlayerOne().getPendingEffects();
    const arielId = testEngine.findCardInstanceId(arielOnHumanLegs, "play", "player_two");
    expect(pendingEffect?.selectionContext).toMatchObject({ kind: "target-selection" });
    expect(pendingEffect?.selectionContext?.kind).toBe("target-selection");
    if (pendingEffect?.selectionContext?.kind !== "target-selection") {
      throw new Error("Expected a target-selection prompt");
    }
    expect(pendingEffect.selectionContext.cardCandidateIds).toEqual([arielId]);

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [arielOnHumanLegs],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mauiSoaringDemigod)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("discard");
  });
});
