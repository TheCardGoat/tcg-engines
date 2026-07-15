import { describe, expect, it } from "bun:test";
import { mauiHeroToAllEnchanted } from "./212-maui-hero-to-all-enchanted";

describe("Maui - Hero to All", () => {
  it("has the printed keyword abilities", () => {
    const keywords = (mauiHeroToAllEnchanted.abilities ?? [])
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
        keyword: "Rush",
      },
      {
        keyword: "Reckless",
      },
    ]);
  });
});
