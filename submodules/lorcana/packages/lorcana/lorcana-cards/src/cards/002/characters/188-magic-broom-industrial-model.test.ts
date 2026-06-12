import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { magicBroomIndustrialModel } from "./188-magic-broom-industrial-model";

describe("Magic Broom - Industrial Model", () => {
  it("MAKE IT SHINE - grants Resist +1 to chosen character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [magicBroomIndustrialModel],
      inkwell: magicBroomIndustrialModel.cost,
      play: [simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(magicBroomIndustrialModel)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(1);
  });

  it("MAKE IT SHINE - Resist +1 persists during opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [magicBroomIndustrialModel],
      inkwell: magicBroomIndustrialModel.cost,
      play: [simbaProtectiveCub],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(magicBroomIndustrialModel)).toBeSuccessfulCommand();

    const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(1);

    testEngine.asServer().passTurn();

    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(1);
  });

  it("MAKE IT SHINE - Resist +1 expires at start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [magicBroomIndustrialModel],
      inkwell: magicBroomIndustrialModel.cost,
      play: [simbaProtectiveCub],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(magicBroomIndustrialModel)).toBeSuccessfulCommand();

    const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(1);

    testEngine.asServer().passTurn();
    testEngine.asServer().passTurn();

    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(null);
  });
});
