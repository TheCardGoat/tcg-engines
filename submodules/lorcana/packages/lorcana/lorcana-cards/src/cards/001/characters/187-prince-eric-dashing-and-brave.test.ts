import { describe, expect, it } from "bun:test";
import { princeEricDashingAndBrave } from "./187-prince-eric-dashing-and-brave";

describe("Prince Eric - Dashing and Brave", () => {
  it("has the printed keyword abilities", () => {
    const keywords = (princeEricDashingAndBrave.abilities ?? [])
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
        keyword: "Challenger",
        value: 2,
      },
    ]);
  });
});
