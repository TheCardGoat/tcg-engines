import { describe, expect, test } from "vite-plus/test";

import { parseKeywords } from "../../src/effect-parser/keywords.ts";

describe("parseKeywords", () => {
  test("parses a card's own keyword", () => {
    expect(
      parseKeywords(
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
      ),
    ).toEqual(["blocker"]);
  });

  test("does not grant a keyword merely referenced after activate the", () => {
    expect(
      parseKeywords(
        "Your opponent cannot activate the [Blocker] of any Character with a cost of 5 or less during this battle.",
      ),
    ).toEqual([]);
  });
});
