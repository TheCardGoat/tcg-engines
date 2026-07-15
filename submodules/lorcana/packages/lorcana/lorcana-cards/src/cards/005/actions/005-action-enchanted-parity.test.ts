import { describe, expect, it } from "bun:test";
import { revive } from "./027-revive";
import { findersKeepers } from "./060-finders-keepers";
import { youreWelcome } from "./096-youre-welcome";
import { royalTantrum } from "./161-royal-tantrum";
import { reviveEnchanted } from "./207-revive-enchanted";
import { findersKeepersEnchanted } from "./210-finders-keepers-enchanted";
import { youreWelcomeEnchanted } from "./213-youre-welcome-enchanted";
import { royalTantrumEnchanted } from "./219-royal-tantrum-enchanted";

describe("set 005 action enchanted parity", () => {
  it("matches Revive enchanted parity", () => {
    expect(reviveEnchanted.canonicalId).toBe(revive.canonicalId);
    expect(reviveEnchanted.missingImplementation).toBe(revive.missingImplementation);
    expect(reviveEnchanted.missingTests).toBe(revive.missingTests);
    expect(reviveEnchanted.abilities).toEqual(revive.abilities);
  });

  it("matches Finders Keepers enchanted parity", () => {
    expect(findersKeepersEnchanted.canonicalId).toBe(findersKeepers.canonicalId);
    expect(findersKeepersEnchanted.missingImplementation).toBe(
      findersKeepers.missingImplementation,
    );
    expect(findersKeepersEnchanted.missingTests).toBe(findersKeepers.missingTests);
    expect(findersKeepersEnchanted.abilities).toEqual(findersKeepers.abilities);
  });

  it("matches Royal Tantrum enchanted parity", () => {
    expect(royalTantrumEnchanted.canonicalId).toBe(royalTantrum.canonicalId);
    expect(royalTantrumEnchanted.missingImplementation).toBe(royalTantrum.missingImplementation);
    expect(royalTantrumEnchanted.missingTests).toBe(royalTantrum.missingTests);
    expect(royalTantrumEnchanted.abilities).toEqual(royalTantrum.abilities);
  });

  it("matches You're Welcome enchanted parity", () => {
    expect(youreWelcomeEnchanted.canonicalId).toBe(youreWelcome.canonicalId);
    expect(youreWelcomeEnchanted.missingImplementation).toBe(youreWelcome.missingImplementation);
    expect(youreWelcomeEnchanted.missingTests).toBe(youreWelcome.missingTests);
    expect(youreWelcomeEnchanted.abilities).toEqual(youreWelcome.abilities);
  });
});
