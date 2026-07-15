import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { holdStill } from "../actions/028-hold-still";
import { belleBookworm } from "./071-belle-bookworm";
import { luciferCunningCat } from "./085-lucifer-cunning-cat";
import { mulanSoldierInTraining } from "./117-mulan-soldier-in-training";

describe("Lucifer - Cunning Cat", () => {
  it("lets the opponent choose to discard 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [luciferCunningCat],
        inkwell: luciferCunningCat.cost,
        deck: 1,
      },
      {
        hand: [holdStill, belleBookworm, mulanSoldierInTraining],
        deck: 1,
      },
    );
    const actionOneId = testEngine.findCardInstanceId(holdStill, "hand", "player_two");
    const characterId = testEngine.findCardInstanceId(belleBookworm, "hand", "player_two");
    const secondCharacterId = testEngine.findCardInstanceId(
      mulanSoldierInTraining,
      "hand",
      "player_two",
    );

    expect(testEngine.asPlayerOne().playCard(luciferCunningCat)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().resolveNextPending({ choiceIndex: 0 })).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [characterId, secondCharacterId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(belleBookworm)).toBe("discard");
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[actionOneId]?.zoneKey,
    ).toBe("hand:player_two");
  });

  it("also supports the discard 1 action card branch", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [luciferCunningCat],
        inkwell: luciferCunningCat.cost,
        deck: 1,
      },
      {
        hand: [holdStill, belleBookworm],
        deck: 1,
      },
    );
    const actionId = testEngine.findCardInstanceId(holdStill, "hand", "player_two");

    expect(testEngine.asPlayerOne().playCard(luciferCunningCat)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().resolveNextPending({ choiceIndex: 1 })).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [actionId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(holdStill)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(belleBookworm)).toBe("hand");
  });
});
