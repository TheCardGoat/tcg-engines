import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { miracleCandle } from "../items/031-miracle-candle";
import { recordPlayer } from "../items/032-record-player";
import { visionSlab } from "../items/100-vision-slab";
import { arielsGrottoASecretPlaceEnchanted } from "./219-ariels-grotto-a-secret-place-enchanted";

describe("Ariel's Grotto - A Secret Place (Enchanted)", () => {
  it("gets +2 lore while you have 3 or more items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielsGrottoASecretPlaceEnchanted, miracleCandle, recordPlayer, visionSlab],
    });

    expect(testEngine.asPlayerOne().getCard(arielsGrottoASecretPlaceEnchanted)?.lore).toBe(
      arielsGrottoASecretPlaceEnchanted.lore + 2,
    );
  });

  it("does NOT get +2 lore with fewer than 3 items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielsGrottoASecretPlaceEnchanted, miracleCandle, recordPlayer],
    });

    expect(testEngine.asPlayerOne().getCard(arielsGrottoASecretPlaceEnchanted)?.lore).toBe(
      arielsGrottoASecretPlaceEnchanted.lore,
    );
  });

  it("gets +2 lore with exactly 3 items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielsGrottoASecretPlaceEnchanted, miracleCandle, recordPlayer, visionSlab],
    });

    expect(testEngine.asPlayerOne().getCard(arielsGrottoASecretPlaceEnchanted)?.lore).toBe(2);
  });
});
