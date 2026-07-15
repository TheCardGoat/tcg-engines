import { describe, expect, it } from "bun:test";
import { healingGlow } from "./028-healing-glow";
import { jetsamUrsulasSpy } from "../characters/046-jetsam-ursulas-spy";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Healing Glow", () => {
  it("Remove up to 2 damage from chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [healingGlow],
      inkwell: healingGlow.cost,
      play: [jetsamUrsulasSpy],
    });

    // Cause two damage to the character
    testEngine.asServer().manualSetDamage(jetsamUrsulasSpy, 2);
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toEqual(2);

    // Healing 2 damage
    testEngine.asPlayerOne().playCard(healingGlow, {
      targets: [jetsamUrsulasSpy],
      amount: 2,
    });
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toEqual("discard");

    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toEqual(0);
  });

  it("may remove 0 damage from a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [healingGlow],
      inkwell: healingGlow.cost,
      play: [jetsamUrsulasSpy],
    });

    // Cause two damage to the character
    testEngine.asServer().manualSetDamage(jetsamUrsulasSpy, 2);
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toEqual(2);

    // Healing 2 damage
    testEngine.asPlayerOne().playCard(healingGlow, {
      targets: [jetsamUrsulasSpy],
      amount: 0,
    });
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toEqual("discard");

    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toEqual(2);
  });
});
