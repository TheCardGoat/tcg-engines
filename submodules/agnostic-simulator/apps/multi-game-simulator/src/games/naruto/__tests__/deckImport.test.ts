import { describe, expect, test } from "vitest";

import { parseDeckListText } from "../pages/deckImport.ts";

describe("parseDeckListText", () => {
  test("parses 3xN-007 lines and a leader line", () => {
    const parsed = parseDeckListText("leader: N-001\n4xN-004\n2 N-007\n# comment\n");
    expect(parsed.errors).toEqual([]);
    expect(parsed.deck.leaderId).toBe("N-001");
    expect(parsed.deck.cardIds.filter((id) => id === "N-004").length).toBe(4);
    expect(parsed.deck.cardIds.filter((id) => id === "N-007").length).toBe(2);
  });

  test("flags unparseable lines", () => {
    const parsed = parseDeckListText("leader: N-001\nthis is not a card line\n");
    expect(parsed.errors).toEqual(["this is not a card line"]);
  });

  test("surfaces engine deckIssues (wrong size)", () => {
    const parsed = parseDeckListText("leader: N-001\n4xN-004\n");
    expect(parsed.issues).toContain("wrongSize");
  });

  test("surfaces engine deckIssues (no leader)", () => {
    const parsed = parseDeckListText("4xN-004\n");
    expect(parsed.issues).toContain("noLeader");
  });
});
