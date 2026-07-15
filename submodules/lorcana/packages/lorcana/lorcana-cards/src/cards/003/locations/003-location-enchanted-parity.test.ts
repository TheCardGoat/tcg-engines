import { describe, expect, it } from "bun:test";
import { prideLandsPrideRock } from "./033-pride-lands-pride-rock";
import { prideLandsPrideRockEnchanted } from "./207-pride-lands-pride-rock-enchanted";
import { kuzcosPalaceHomeOfTheEmperor } from "./102-kuzcos-palace-home-of-the-emperor";
import { kuzcosPalaceHomeOfTheEmperorEnchanted } from "./213-kuzcos-palace-home-of-the-emperor-enchanted";
import { rlsLegacySolarGalleon } from "./136-rls-legacy-solar-galleon";
import { rlsLegacySolarGalleonEnchanted } from "./216-rls-legacy-solar-galleon-enchanted";
import { bellesHouseMauricesWorkshop } from "./168-belles-house-maurices-workshop";
import { bellesHouseMauricesWorkshopEnchanted } from "./219-belles-house-maurices-workshop-enchanted";

describe("set 003 location enchanted parity", () => {
  it("keeps Pride Lands enchanted aligned with the base card behavior", () => {
    expect(prideLandsPrideRockEnchanted.canonicalId).toBe(prideLandsPrideRock.canonicalId);
    expect(prideLandsPrideRockEnchanted.abilities).toEqual(prideLandsPrideRock.abilities);
    expect(prideLandsPrideRockEnchanted.missingImplementation).toBe(
      prideLandsPrideRock.missingImplementation,
    );
    expect(prideLandsPrideRockEnchanted.missingTests).toBe(prideLandsPrideRock.missingTests);
  });

  it("keeps Kuzco's Palace enchanted aligned with the base card behavior", () => {
    expect(kuzcosPalaceHomeOfTheEmperorEnchanted.canonicalId).toBe(
      kuzcosPalaceHomeOfTheEmperor.canonicalId,
    );
    expect(kuzcosPalaceHomeOfTheEmperorEnchanted.abilities).toEqual(
      kuzcosPalaceHomeOfTheEmperor.abilities,
    );
    expect(kuzcosPalaceHomeOfTheEmperorEnchanted.missingImplementation).toBe(
      kuzcosPalaceHomeOfTheEmperor.missingImplementation,
    );
    expect(kuzcosPalaceHomeOfTheEmperorEnchanted.missingTests).toBe(
      kuzcosPalaceHomeOfTheEmperor.missingTests,
    );
  });

  it("keeps RLS Legacy enchanted aligned with the base card behavior", () => {
    expect(rlsLegacySolarGalleonEnchanted.canonicalId).toBe(rlsLegacySolarGalleon.canonicalId);
    expect(rlsLegacySolarGalleonEnchanted.abilities).toEqual(rlsLegacySolarGalleon.abilities);
    expect(rlsLegacySolarGalleonEnchanted.missingImplementation).toBe(
      rlsLegacySolarGalleon.missingImplementation,
    );
    expect(rlsLegacySolarGalleonEnchanted.missingTests).toBe(rlsLegacySolarGalleon.missingTests);
  });

  it("keeps Belle's House enchanted aligned with the base card behavior", () => {
    expect(bellesHouseMauricesWorkshopEnchanted.canonicalId).toBe(
      bellesHouseMauricesWorkshop.canonicalId,
    );
    expect(bellesHouseMauricesWorkshopEnchanted.abilities).toEqual(
      bellesHouseMauricesWorkshop.abilities,
    );
    expect(bellesHouseMauricesWorkshopEnchanted.missingImplementation).toBe(
      bellesHouseMauricesWorkshop.missingImplementation,
    );
    expect(bellesHouseMauricesWorkshopEnchanted.missingTests).toBe(
      bellesHouseMauricesWorkshop.missingTests,
    );
  });
});
