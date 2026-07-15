import { describe, expect, it } from "bun:test";
import { herculesTrueHero } from "./181-hercules-true-hero";

describe("Hercules - True Hero", () => {
  it("has the printed keyword abilities", () => {
    const keywords = (herculesTrueHero.abilities ?? [])
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
        keyword: "Bodyguard",
      },
    ]);
  });
});
