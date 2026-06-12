/**
 * Deck list text parsing tests.
 */

import { describe, expect, it } from "bun:test";
import { parseDeckListText, parseDeckListTextWithErrors } from "./deck-list-parse";

describe("parseDeckListText", () => {
  it("returns empty array for empty string", () => {
    expect(parseDeckListText("")).toEqual([]);
  });

  it("parses main-only lines", () => {
    const text = `
4 Hades - Infernal Schemer
2 Vision of the Future
1 Elsa - Snow Queen
`;
    expect(parseDeckListText(text)).toEqual([
      { quantity: 4, cardName: "Hades - Infernal Schemer" },
      { quantity: 2, cardName: "Vision of the Future" },
      { quantity: 1, cardName: "Elsa - Snow Queen" },
    ]);
  });

  it("merges main and sideboard; ignores maybeboard", () => {
    const text = `
4 Card A
2 Card B

--- SIDEBOARD
1 Card C
2 Card D

--- MAYBEBOARD
3 Card E
1 Card F
`;
    expect(parseDeckListText(text)).toEqual([
      { quantity: 4, cardName: "Card A" },
      { quantity: 2, cardName: "Card B" },
      { quantity: 1, cardName: "Card C" },
      { quantity: 2, cardName: "Card D" },
    ]);
  });

  it("treats SIDEBOARD section case-insensitively", () => {
    const text = `
1 MainCard
--- sideboard
1 SideCard
`;
    expect(parseDeckListText(text)).toEqual([
      { quantity: 1, cardName: "MainCard" },
      { quantity: 1, cardName: "SideCard" },
    ]);
  });

  it("ignores MAYBEBOARD case-insensitively", () => {
    const text = `
1 MainCard
--- maybeboard
2 MaybeCard
`;
    expect(parseDeckListText(text)).toEqual([{ quantity: 1, cardName: "MainCard" }]);
  });

  it("skips blank lines", () => {
    const text = `
4 Card A


2 Card B
`;
    expect(parseDeckListText(text)).toEqual([
      { quantity: 4, cardName: "Card A" },
      { quantity: 2, cardName: "Card B" },
    ]);
  });

  it("strips trailing parenthetical for lookup", () => {
    const text = `
4 Hades - Infernal Schemer (PROMO)
2 Vision of the Future (ENCHANTED)
1 Elsa (Set 1)
`;
    expect(parseDeckListText(text)).toEqual([
      { quantity: 4, cardName: "Hades - Infernal Schemer" },
      { quantity: 2, cardName: "Vision of the Future" },
      { quantity: 1, cardName: "Elsa" },
    ]);
  });

  it("skips lines that do not match quantity + card name", () => {
    const text = `
4 Valid Card
no number here
  another invalid
2 Another Valid
`;
    expect(parseDeckListText(text)).toEqual([
      { quantity: 4, cardName: "Valid Card" },
      { quantity: 2, cardName: "Another Valid" },
    ]);
  });

  it("skips zero or negative quantity", () => {
    const text = `
0 Skip Zero
4 Valid
-1 Skip Negative
`;
    expect(parseDeckListText(text)).toEqual([{ quantity: 4, cardName: "Valid" }]);
  });

  it("handles section headers as literal if not exact match", () => {
    const text = `
1 Card Before
--- SIDEBOARD extra
2 Not Sideboard Line
`;
    expect(parseDeckListText(text)).toEqual([
      { quantity: 1, cardName: "Card Before" },
      { quantity: 2, cardName: "Not Sideboard Line" },
    ]);
  });
});

describe("parseDeckListTextWithErrors", () => {
  it("returns same entries as parseDeckListText when no invalid lines", () => {
    const text = `
4 Hades - Infernal Schemer
2 Vision of the Future
`;
    const withErrors = parseDeckListTextWithErrors(text);
    expect(withErrors.entries).toEqual(parseDeckListText(text));
    expect(withErrors.invalid).toEqual([]);
  });

  it("collects malformed lines with lineNumber", () => {
    const text = `
4 Valid Card
no number here
2 Another Valid
0 Zero Card
`;
    const { entries, invalid } = parseDeckListTextWithErrors(text);
    expect(entries).toEqual([
      { quantity: 4, cardName: "Valid Card" },
      { quantity: 2, cardName: "Another Valid" },
    ]);
    expect(invalid).toEqual([
      { kind: "malformed", text: "no number here", lineNumber: 3 },
      { kind: "malformed", text: "0 Zero Card", lineNumber: 5 },
    ]);
  });

  it("does not add blank lines or section headers to invalid", () => {
    const text = `
4 Card A

--- SIDEBOARD
1 Card B
`;
    const { entries, invalid } = parseDeckListTextWithErrors(text);
    expect(entries).toEqual([
      { quantity: 4, cardName: "Card A" },
      { quantity: 1, cardName: "Card B" },
    ]);
    expect(invalid).toEqual([]);
  });
});
