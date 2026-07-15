import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack, simbaProtectiveCub } from "../../001";
import { educationOrElimination } from "./097-education-or-elimination";

describe("Education or Elimination", () => {
  it("exposes the printed mode text on the pending choice prompt", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [educationOrElimination],
      inkwell: educationOrElimination.cost,
      play: [simbaProtectiveCub],
      deck: [heiheiBoatSnack],
    });

    expect(testEngine.asPlayerOne().playCard(educationOrElimination).success).toBe(true);

    const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
    expect(pendingEffects).toHaveLength(1);
    const selectionContext = pendingEffects[0]?.selectionContext;
    expect(selectionContext?.kind).toBe("choice-selection");
    if (selectionContext?.kind !== "choice-selection") {
      throw new Error("expected choice-selection context");
    }

    expect(selectionContext.options.map((option) => option.label)).toEqual([
      "Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn.",
      "Banish chosen damaged character.",
    ]);
  });

  it("draws a card and buffs your chosen character when the first mode is chosen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [educationOrElimination],
      inkwell: educationOrElimination.cost,
      play: [simbaProtectiveCub],
      deck: [heiheiBoatSnack],
    });

    expect(
      testEngine.asPlayerOne().playCardWithChoice(educationOrElimination, 0, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardLore(simbaProtectiveCub)).toBe(
      simbaProtectiveCub.lore + 1,
    );
    expect(testEngine.asPlayerOne().getCard(simbaProtectiveCub)?.hasEvasive).toBe(true);
  });

  it("banishes the chosen damaged character when the second mode is chosen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [educationOrElimination],
        inkwell: educationOrElimination.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asServer().manualSetDamage(simbaProtectiveCub, 1)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCardWithChoice(educationOrElimination, 1, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });

  it("advances from the second mode choice to a damaged-character target prompt", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [educationOrElimination],
        inkwell: educationOrElimination.cost,
        deck: [],
      },
      {
        play: [simbaProtectiveCub],
        deck: [],
      },
    );

    expect(testEngine.asServer().manualSetDamage(simbaProtectiveCub, 1)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(educationOrElimination)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().respondWithChoice(1)).toBeSuccessfulCommand();

    const damagedCharacterId = testEngine.findCardInstanceId(
      simbaProtectiveCub,
      "play",
      "player_two",
    );
    const [targetPrompt] = testEngine.asPlayerOne().getPendingEffects();
    expect(targetPrompt?.selectionContext).toMatchObject({
      kind: "target-selection",
      cardCandidateIds: [damagedCharacterId],
    });

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacterId] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });
});
