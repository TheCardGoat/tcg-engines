import { describe, expect, it } from "bun:test";
import { gadgetHackwrenchBrilliantBosun } from "./140-gadget-hackwrench-brilliant-bosun";
import { gadgetHackwrenchBrilliantBosunEnchanted } from "./217-gadget-hackwrench-brilliant-bosun-enchanted";

describe("Gadget Hackwrench - Brilliant Bosun Enchanted", () => {
  it("matches Brilliant Bosun parity", () => {
    expect(gadgetHackwrenchBrilliantBosunEnchanted.canonicalId).toBe(
      gadgetHackwrenchBrilliantBosun.canonicalId,
    );
    expect(gadgetHackwrenchBrilliantBosunEnchanted.missingImplementation).toBe(
      gadgetHackwrenchBrilliantBosun.missingImplementation,
    );
    expect(gadgetHackwrenchBrilliantBosunEnchanted.missingTests).toBe(
      gadgetHackwrenchBrilliantBosun.missingTests,
    );
    expect(gadgetHackwrenchBrilliantBosunEnchanted.abilities).toEqual(
      gadgetHackwrenchBrilliantBosun.abilities,
    );
  });
});
