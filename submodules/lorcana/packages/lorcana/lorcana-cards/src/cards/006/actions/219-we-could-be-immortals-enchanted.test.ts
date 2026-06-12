import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { gadgetHackwrenchPerceptiveMouse } from "../characters";
import { weCouldBeImmortals } from "./162-we-could-be-immortals";
import { weCouldBeImmortalsEnchanted } from "./219-we-could-be-immortals-enchanted";

describe("We Could Be Immortals (Enchanted)", () => {
  it("gives only your Inventor characters Resist +6 and puts itself into your inkwell exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weCouldBeImmortalsEnchanted],
      inkwell: weCouldBeImmortalsEnchanted.cost,
      play: [gadgetHackwrenchPerceptiveMouse, simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(weCouldBeImmortalsEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(gadgetHackwrenchPerceptiveMouse, "Resist")).toBe(6);
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBeNull();
    expect(testEngine.asPlayerOne().getCardZone(weCouldBeImmortalsEnchanted)).toBe("inkwell");
    expect(testEngine.asPlayerOne().isExerted(weCouldBeImmortalsEnchanted)).toBe(true);
  });

  it("shares the same canonical id and abilities as the base card", () => {
    expect(weCouldBeImmortalsEnchanted.canonicalId).toBe(weCouldBeImmortals.canonicalId);
    expect(weCouldBeImmortalsEnchanted.abilities).toEqual(weCouldBeImmortals.abilities);
  });
});
