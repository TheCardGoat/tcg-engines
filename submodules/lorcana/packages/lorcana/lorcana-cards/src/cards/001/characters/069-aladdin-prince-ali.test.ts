import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli } from "./069-aladdin-prince-ali";

describe("Aladdin - Prince Ali", () => {
  it("has the printed keyword abilities", () => {
    const keywords = (aladdinPrinceAli.abilities ?? [])
      .filter((ability) => ability.type === "keyword")
      .map((ability) =>
        ability.type === "keyword" && "value" in ability && typeof ability.value === "number"
          ? { keyword: ability.keyword, value: ability.value }
          : ability.type === "keyword"
            ? { keyword: ability.keyword }
            : null,
      )
      .filter((ability) => ability !== null);

    expect(keywords).toEqual([
      {
        keyword: "Ward",
      },
    ]);
  });

  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [aladdinPrinceAli],
    });

    const cardUnderTest = testEngine.getCardModel(aladdinPrinceAli);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
