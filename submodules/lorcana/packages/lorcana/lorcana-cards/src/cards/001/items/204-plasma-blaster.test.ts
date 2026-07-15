import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { jetsamUrsulasSpy } from "../characters";
import { plasmaBlaster } from "./204-plasma-blaster";

describe("Plasma Blaster", () => {
  it("deals 1 damage to the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [plasmaBlaster, jetsamUrsulasSpy],
      inkwell: 2,
    });

    testEngine.asServer().manualSetDamage(jetsamUrsulasSpy, 1);
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toBe(1);

    const result = testEngine.asPlayerOne().activateAbility(plasmaBlaster, {
      ability: "QUICK SHOT",
      targets: [jetsamUrsulasSpy],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(plasmaBlaster)).toBe(true);
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toBe(2);
  });
});
