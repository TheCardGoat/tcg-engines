import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { sebastianCourtComposer } from "./019-sebastian-court-composer";
import { hakunaMatata } from "../actions/027-hakuna-matata";
import { grabYourSword } from "../actions/198-grab-your-sword";

describe("Sebastian - Court Composer", () => {
  it("should have Singer 4 keyword", () => {
    const singerAbility = (sebastianCourtComposer.abilities ?? []).find(
      (a) => a.type === "keyword" && "keyword" in a && a.keyword === "Singer",
    );
    expect(singerAbility).toBeDefined();
    expect(singerAbility && "value" in singerAbility ? singerAbility.value : 0).toBe(4);
  });

  it("SINGER 4 - can sing a song costing exactly 4", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hakunaMatata],
      play: [sebastianCourtComposer],
    });

    expect(
      testEngine.asPlayerOne().singSong(hakunaMatata, sebastianCourtComposer),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(hakunaMatata)).toBe("discard");
    expect(testEngine.asPlayerOne().isExerted(sebastianCourtComposer)).toBe(true);
  });

  it("SINGER 4 - cannot sing a song costing more than 4", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [grabYourSword],
      play: [sebastianCourtComposer],
    });

    expect(
      testEngine.asPlayerOne().singSong(grabYourSword, sebastianCourtComposer),
    ).not.toBeSuccessfulCommand();
  });
});
