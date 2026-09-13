import { describe, expect, test } from "vitest";

import { parseDeckListText, parseNarutoPracticeDeckPayload } from "../pages/deckImport.ts";

describe("parseDeckListText", () => {
  test("parses main, leader, Chakra, and Summon setup lines", () => {
    const parsed = parseDeckListText(
      "leader: N-001\n4xN-004\n2 N-007\nchakra: 5xC-001\nsummon: S-001\n# comment\n",
    );
    expect(parsed.errors).toEqual([]);
    expect(parsed.deck.leaderId).toBe("N-001");
    expect(parsed.deck.cardIds.filter((id) => id === "N-004").length).toBe(4);
    expect(parsed.deck.cardIds.filter((id) => id === "N-007").length).toBe(2);
    expect(parsed.deck.chakraCardIds).toEqual(["C-001", "C-001", "C-001", "C-001", "C-001"]);
    expect(parsed.deck.summonCardId).toBe("S-001");
  });

  test("flags unparseable lines", () => {
    const parsed = parseDeckListText("leader: N-001\nthis is not a card line\n");
    expect(parsed.errors).toEqual(["this is not a card line"]);
  });

  test("surfaces engine deckIssues (wrong size)", () => {
    const parsed = parseDeckListText("leader: N-001\n4xN-004\nchakra: 5xC-001\nsummon: S-001\n");
    expect(parsed.issues).toContain("wrongSize");
    expect(parsed.practiceIssues).not.toContain("wrongSize");
  });

  test("round-trips the V2 builder payload with automatic setup cards", () => {
    const payload = Buffer.from(
      JSON.stringify({ v: 2, l: "N-001", m: { "N-004": 6 }, ca: "CP-001", sa: "S-001" }),
    ).toString("base64url");
    const parsed = parseNarutoPracticeDeckPayload(payload);

    expect(parsed.errors).toEqual([]);
    expect(parsed.deck.cardIds).toHaveLength(6);
    expect(parsed.deck.chakraCardIds).toEqual(Array.from({ length: 5 }, () => "CP-001"));
    expect(parsed.practiceIssues).toEqual([]);
    expect(parsed.issues).toEqual(expect.arrayContaining(["wrongSize", "tooManyCopies"]));
  });

  test("rejects V1, tampered, and transport-oversized payloads", () => {
    const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");

    expect(parseNarutoPracticeDeckPayload(encode({ v: 1 })).errors).not.toEqual([]);
    expect(parseNarutoPracticeDeckPayload("not-json").errors).not.toEqual([]);
    expect(
      parseNarutoPracticeDeckPayload(
        encode({ v: 2, l: "N-001", m: { "N-004": 100 }, ca: "C-001", sa: "S-001" }),
      ).errors,
    ).not.toEqual([]);
  });

  test("surfaces engine deckIssues (no leader)", () => {
    const parsed = parseDeckListText("4xN-004\nchakra: 5xC-001\nsummon: S-001\n");
    expect(parsed.issues).toContain("noLeader");
  });

  test("does not attach hidden Preview side-card identities", () => {
    const parsed = parseDeckListText("leader: N-001\n4xN-004\n");

    expect(parsed.deck.chakraCardIds).toEqual([]);
    expect(parsed.deck.summonCardId).toBe("");
    expect(parsed.issues).toEqual(expect.arrayContaining(["wrongChakraCount", "noSummon"]));
  });

  test("rejects multiple or non-singleton Summon declarations", () => {
    const nonSingleton = parseDeckListText("summon: 2xS-001\n");
    const duplicate = parseDeckListText("summon: S-001\nsummon: S-001\n");

    expect(nonSingleton.errors).toEqual(["summon: 2xS-001"]);
    expect(duplicate.errors).toEqual(["summon: S-001"]);
  });
});
