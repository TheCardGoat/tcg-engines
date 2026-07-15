import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { allIsFound } from "./178-all-is-found";

describe("All Is Found", () => {
  it("puts up to 2 cards from your discard into your inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [allIsFound],
      inkwell: allIsFound.cost,
      discard: [simbaProtectiveCub, arielOnHumanLegs],
    });

    expect(
      testEngine.asPlayerOne().playCard(allIsFound, {
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
});
