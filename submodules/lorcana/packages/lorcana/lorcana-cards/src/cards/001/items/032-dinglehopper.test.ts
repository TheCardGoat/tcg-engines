import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { jetsamUrsulasSpy } from "../characters";
import { dinglehopper } from "./032-dinglehopper";

describe("Dinglehopper", () => {
  it("removes up to 1 damage from the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [jetsamUrsulasSpy, dinglehopper],
    });

    testEngine.asServer().manualSetDamage(jetsamUrsulasSpy, 2);
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toEqual(2);

    expect(
      testEngine.asPlayerOne().activateAbility(dinglehopper, {
        ability: "STRAIGHTEN HAIR",
        targets: [jetsamUrsulasSpy],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(dinglehopper)).toEqual(true);
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toEqual(1);
  });

  it("can target a character with no damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [jetsamUrsulasSpy, dinglehopper],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(dinglehopper, {
        ability: "STRAIGHTEN HAIR",
        targets: [jetsamUrsulasSpy],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(dinglehopper)).toEqual(true);
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toEqual(0);
  });
});
