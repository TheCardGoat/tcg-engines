import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peterPanTinkerBellFastFriends } from "./060-peter-pan-tinker-bell-fast-friends";

const peterPanShiftBase = createMockCharacter({
  id: "peter-tink-fast-friends-shift-base",
  name: "Peter Pan",
  cost: 2,
});

const friendlyCharacter = createMockCharacter({
  id: "peter-tink-fast-friends-friendly",
  name: "Friendly Character",
  cost: 2,
});

describe("Peter Pan & Tinker Bell - Fast Friends", () => {
  it("can shift onto a character named Peter Pan", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peterPanTinkerBellFastFriends],
      play: [peterPanShiftBase],
      inkwell: 4,
    });
    const shiftTarget = testEngine.findCardInstanceId(peterPanShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(peterPanTinkerBellFastFriends, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(peterPanTinkerBellFastFriends)).toBe("play");
  });

  it("gives your characters Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [peterPanTinkerBellFastFriends, friendlyCharacter],
    });

    expect(testEngine.asPlayerOne().hasKeyword(friendlyCharacter, "Evasive")).toBe(true);
  });
});
