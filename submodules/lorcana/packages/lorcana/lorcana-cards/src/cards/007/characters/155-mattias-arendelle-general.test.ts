import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elsaIceMaker } from "./069-elsa-ice-maker";
import { mattiasArendelleGeneral } from "./155-mattias-arendelle-general";

const nonQueenCharacter = createMockCharacter({
  id: "mattias-test-non-queen",
  name: "Non Queen Character",
  cost: 2,
  classifications: ["Storyborn", "Ally"],
});

describe("Mattias - Arendelle General", () => {
  it("PROUD TO SERVE - grants Ward to Queen characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: mattiasArendelleGeneral, isDrying: false },
        { card: elsaIceMaker, isDrying: false },
        { card: nonQueenCharacter, isDrying: false },
      ],
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: elsaIceMaker,
      keyword: "Ward",
    });
  });

  it("PROUD TO SERVE - does not grant Ward to non-Queen characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: mattiasArendelleGeneral, isDrying: false },
        { card: nonQueenCharacter, isDrying: false },
      ],
    });

    expect(testEngine.hasKeyword(nonQueenCharacter, "Ward")).toBe(false);
  });

  it("PROUD TO SERVE - Mattias himself does not gain Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mattiasArendelleGeneral, isDrying: false }],
    });

    expect(testEngine.hasKeyword(mattiasArendelleGeneral, "Ward")).toBe(false);
  });
});
