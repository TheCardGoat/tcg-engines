import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { flounderVoiceOfReason } from "./147-flounder-voice-of-reason";

describe("Flounder - Voice of Reason (set 009)", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [flounderVoiceOfReason],
    });

    expect(flounderVoiceOfReason).toMatchObject({
      id: "e6d",
      canonicalId: "ci_nWw",
      reprints: ["set1-145", "set9-147"],
      cardType: "character",
      name: "Flounder",
      version: "Voice of Reason",
      set: "009",
      cardNumber: 147,
      rarity: "common",
      cost: 1,
      strength: 2,
      willpower: 2,
      lore: 1,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Ally"],
    });

    expect(flounderVoiceOfReason.missingImplementation).toBeUndefined();
    expect(flounderVoiceOfReason.missingTests).toBeUndefined();
    expect(flounderVoiceOfReason.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(flounderVoiceOfReason).hasAbility).toBe(false);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [flounderVoiceOfReason],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(flounderVoiceOfReason)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });
});
