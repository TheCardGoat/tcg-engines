import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli, arielOnHumanLegs } from "../../001";
import { howFarIllGo } from "./161-how-far-ill-go";

describe("How Far I'll Go", () => {
  it("puts one looked-at card into your hand and the other into your inkwell exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [howFarIllGo],
      inkwell: howFarIllGo.cost,
      deck: [aladdinPrinceAli, arielOnHumanLegs],
    });

    expect(
      testEngine.asPlayerOne().playCard(howFarIllGo, {
        destinations: [
          {
            zone: "hand",
            cards: [arielOnHumanLegs],
          },
          {
            zone: "inkwell",
            cards: [aladdinPrinceAli],
          },
        ],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("inkwell");
    expect(testEngine.isExerted(aladdinPrinceAli)).toBe(true);
  });
});
