import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { mickeyMouseDetective } from "../../001";
import { donaldDuckGhostHunter } from "../../010";
import { doYouWantToBuildASnowman } from "./061-do-you-want-to-build-a-snowman";

describe("Do You Want to Build a Snowman?", () => {
  it("gains 3 lore when the chosen opponent answers YES", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [doYouWantToBuildASnowman],
        inkwell: doYouWantToBuildASnowman.cost,
      },
      {
        play: [donaldDuckGhostHunter],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(doYouWantToBuildASnowman).success).toBe(true);
    expect(testEngine.asPlayerTwo().resolveNextPending({ choiceIndex: 0 })).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(3);
  });

  it("exposes descriptive YES! and NO! labels on the choice selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [doYouWantToBuildASnowman],
        inkwell: doYouWantToBuildASnowman.cost,
      },
      {
        play: [donaldDuckGhostHunter],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(doYouWantToBuildASnowman).success).toBe(true);

    const pendingEffects = testEngine.asPlayerTwo().getPendingEffects();
    expect(pendingEffects).toHaveLength(1);
    const selectionContext = pendingEffects[0]?.selectionContext;
    expect(selectionContext?.kind).toBe("choice-selection");
    if (selectionContext?.kind !== "choice-selection") {
      throw new Error("expected choice-selection context");
    }

    const labels = selectionContext.options.map((option) => option.label);
    expect(labels[0]).toContain("YES!");
    expect(labels[1]).toContain("NO!");
  });

  it("lets the chosen opponent put one of their characters on the bottom of their deck when they answer NO", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [doYouWantToBuildASnowman],
        inkwell: doYouWantToBuildASnowman.cost,
      },
      {
        play: [donaldDuckGhostHunter, mickeyMouseDetective],
        deck: 5,
      },
    );
    const donaldId = testEngine.findCardInstanceId(donaldDuckGhostHunter, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(doYouWantToBuildASnowman).success).toBe(true);
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        choiceIndex: 1,
      }).success,
    ).toBe(true);
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [donaldId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
    expect(testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[donaldId]?.zoneKey).toBe(
      "deck:player_two",
    );
    expect(testEngine.asPlayerTwo().getZonesCardCount().deck).toBe(6);
  });
});
