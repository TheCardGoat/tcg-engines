import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { allIsFound } from "./178-all-is-found";
import { allIsFoundEnchanted } from "./220-all-is-found-enchanted";

describe("All Is Found - Enchanted", () => {
  it("has the same canonicalId and abilities as the non-enchanted version", () => {
    expect(allIsFoundEnchanted.canonicalId).toBe(allIsFound.canonicalId);
    expect(allIsFoundEnchanted.abilities).toEqual(allIsFound.abilities);
  });

  it("puts up to 2 cards from your discard into your inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [allIsFoundEnchanted],
      inkwell: allIsFoundEnchanted.cost,
      discard: [simbaProtectiveCub, arielOnHumanLegs],
    });

    expect(
      testEngine.asPlayerOne().playCard(allIsFoundEnchanted, {
        targets: [simbaProtectiveCub, arielOnHumanLegs],
      }).success,
    ).toBe(true);

    expect(testEngine.getCard(simbaProtectiveCub)).toBeInZone("inkwell");
    expect(testEngine.getCard(arielOnHumanLegs)).toBeInZone("inkwell");
    expect(testEngine.getCardPublicFaceState(simbaProtectiveCub, "inkwell")).toBe("faceDown");
    expect(testEngine.getCardPublicFaceState(arielOnHumanLegs, "inkwell")).toBe("faceDown");
    expect(testEngine.getCard(simbaProtectiveCub)?.exerted).toBe(true);
    expect(testEngine.getCard(arielOnHumanLegs)?.exerted).toBe(true);
  });

  it("can choose to put only 1 card when up to 2 is allowed", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [allIsFoundEnchanted],
      inkwell: allIsFoundEnchanted.cost,
      discard: [simbaProtectiveCub, arielOnHumanLegs],
    });

    expect(
      testEngine.asPlayerOne().playCard(allIsFoundEnchanted, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.getCard(simbaProtectiveCub)).toBeInZone("inkwell");
    expect(testEngine.getCard(arielOnHumanLegs)).toBeInZone("discard");
  });
});
