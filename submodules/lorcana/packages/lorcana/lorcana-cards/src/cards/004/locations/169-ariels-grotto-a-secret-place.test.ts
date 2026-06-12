import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { miracleCandle } from "../items/031-miracle-candle";
import { recordPlayer } from "../items/032-record-player";
import { visionSlab } from "../items/100-vision-slab";
import { arielsGrottoASecretPlace } from "./169-ariels-grotto-a-secret-place";

describe("Ariel's Grotto - A Secret Place", () => {
  it("gets +2 lore while you have 3 or more items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielsGrottoASecretPlace, miracleCandle, recordPlayer, visionSlab],
    });

    expect(testEngine.asPlayerOne().getCard(arielsGrottoASecretPlace)?.lore).toBe(
      arielsGrottoASecretPlace.lore + 2,
    );
  });

  it("does NOT get +2 lore with fewer than 3 items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielsGrottoASecretPlace, miracleCandle, recordPlayer],
    });

    expect(testEngine.asPlayerOne().getCard(arielsGrottoASecretPlace)?.lore).toBe(
      arielsGrottoASecretPlace.lore,
    );
  });

  it("gets +2 lore with exactly 3 items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielsGrottoASecretPlace, miracleCandle, recordPlayer, visionSlab],
    });

    expect(testEngine.asPlayerOne().getCard(arielsGrottoASecretPlace)?.lore).toBe(2);
  });
});
