import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { hakunaMatata } from "../../001/actions/027-hakuna-matata";
import { grabYourSword } from "../../001/actions/198-grab-your-sword";
import { alanadaleLoyalBard } from "./007-alan-a-dale-loyal-bard";

describe("Alan-a-Dale - Loyal Bard", () => {
  it("should have Singer 4 keyword", () => {
    const singerAbility = (alanadaleLoyalBard.abilities ?? []).find(
      (a) => a.type === "keyword" && "keyword" in a && a.keyword === "Singer",
    );
    expect(singerAbility).toBeDefined();
    expect(singerAbility && "value" in singerAbility ? singerAbility.value : 0).toBe(4);
  });

  it("SINGER 4 - can sing a song costing exactly 4", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hakunaMatata],
      play: [alanadaleLoyalBard],
    });

    expect(
      testEngine.asPlayerOne().singSong(hakunaMatata, alanadaleLoyalBard),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(hakunaMatata)).toBe("discard");
    expect(testEngine.asPlayerOne().isExerted(alanadaleLoyalBard)).toBe(true);
  });

  it("SINGER 4 - cannot sing a song costing more than 4", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [grabYourSword],
      play: [alanadaleLoyalBard],
    });

    expect(
      testEngine.asPlayerOne().singSong(grabYourSword, alanadaleLoyalBard),
    ).not.toBeSuccessfulCommand();
  });
});
