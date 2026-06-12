import { describe, expect, it } from "bun:test";
import { freezeTheVine } from "./096-freeze-the-vine";
import { freezeTheVineEnchanted } from "./231-freeze-the-vine-enchanted";

describe("Freeze the Vine - Enchanted", () => {
  it("matches Freeze the Vine parity", () => {
    expect(freezeTheVineEnchanted.canonicalId).toBe(freezeTheVine.canonicalId);
    expect(freezeTheVineEnchanted.missingImplementation).toBe(freezeTheVine.missingImplementation);
    expect(freezeTheVineEnchanted.missingTests).toBe(freezeTheVine.missingTests);
    expect(freezeTheVineEnchanted.abilities).toEqual(freezeTheVine.abilities);
  });
});
