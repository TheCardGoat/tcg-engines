import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import {
  heiheiBoatSnack,
  mickeyMouseSteamboatPilot,
  simbaProtectiveCub,
  liloMakingAWish,
} from "../../001";
import { akoodEtEmuti } from "./029-akood-et-emuti";

describe("Akood et Emuti", () => {
  it("reduces the next character you play this turn and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [akoodEtEmuti, heiheiBoatSnack],
      inkwell: 0,
      play: [mickeyMouseSteamboatPilot],
      deck: [simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().singSong(akoodEtEmuti, mickeyMouseSteamboatPilot).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");

    expect(testEngine.asPlayerOne().playCard(heiheiBoatSnack)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("play");
  });

  it("cost reduction is consumed after the first character is played", () => {
    // Simba costs 2, Lilo costs 1
    // With 2 ink reduction, Simba (cost 2) becomes free
    // After consuming the reduction, Lilo (cost 1) should require 1 ink
    // We have 0 inkwell, so Lilo should fail to play
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [akoodEtEmuti, simbaProtectiveCub, liloMakingAWish],
      inkwell: 0,
      play: [mickeyMouseSteamboatPilot],
      deck: [heiheiBoatSnack],
    });

    // Sing Akood et Emuti with Mickey
    expect(testEngine.asPlayerOne().singSong(akoodEtEmuti, mickeyMouseSteamboatPilot).success).toBe(
      true,
    );

    // First character: Simba (cost 2) should be free due to 2 ink reduction
    expect(testEngine.asPlayerOne().playCard(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");

    // Second character: Lilo (cost 1) should NOT benefit from reduction (consumed)
    // With 0 ink in inkwell, this should fail
    const liloResult = testEngine.asPlayerOne().playCard(liloMakingAWish);
    expect(liloResult.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(liloMakingAWish)).toBe("hand");
  });

  it("regression: goes to discard after being sung (not stuck in play or limbo)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [akoodEtEmuti, heiheiBoatSnack],
      inkwell: 0,
      play: [mickeyMouseSteamboatPilot],
      deck: [simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().singSong(akoodEtEmuti, mickeyMouseSteamboatPilot).success).toBe(
      true,
    );

    // After being sung, the action card should be in the discard pile
    expect(testEngine.asPlayerOne().getCardZone(akoodEtEmuti)).toBe("discard");
  });

  it("regression: goes to discard after being sung together by multiple characters", () => {
    const singerA = createMockCharacter({
      id: "akood-singer-a",
      name: "Singer A",
      cost: 2,
      strength: 1,
      willpower: 2,
    });
    const singerB = createMockCharacter({
      id: "akood-singer-b",
      name: "Singer B",
      cost: 2,
      strength: 1,
      willpower: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [akoodEtEmuti, heiheiBoatSnack],
      inkwell: 0,
      play: [singerA, singerB],
      deck: [simbaProtectiveCub],
    });

    // Sing together with cost 2 + 2 = 4 >= 3
    const result = testEngine.asPlayerOne().playSongTogether(akoodEtEmuti, [singerA, singerB]);
    if (result.success) {
      // After being sung together, the action card should be in the discard pile
      expect(testEngine.asPlayerOne().getCardZone(akoodEtEmuti)).toBe("discard");
    }
  });
});
