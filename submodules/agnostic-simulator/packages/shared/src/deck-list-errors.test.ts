/**
 * Deck list invalid entry types and formatter tests.
 */

import { describe, expect, it } from "bun:test";
import type { DeckListInvalidEntry } from "./deck-list-errors";
import { formatInvalidEntriesComment } from "./deck-list-errors";

describe("formatInvalidEntriesComment", () => {
  it("returns empty string for empty array", () => {
    expect(formatInvalidEntriesComment([])).toBe("");
  });

  it("formats not_found entries under # NOT FOUND", () => {
    const entries: DeckListInvalidEntry[] = [
      { kind: "not_found", text: "Hades - Infernal Scheemer" },
      { kind: "not_found", text: "Vision of Future" },
    ];
    expect(formatInvalidEntriesComment(entries)).toBe(
      "# NOT FOUND\n## Hades - Infernal Scheemer\n## Vision of Future",
    );
  });

  it("formats malformed entries under # MALFORMED", () => {
    const entries: DeckListInvalidEntry[] = [
      { kind: "malformed", text: "no quantity here" },
      { kind: "malformed", text: "0 Zero Card", lineNumber: 3 },
    ];
    expect(formatInvalidEntriesComment(entries)).toBe(
      "# MALFORMED\n## no quantity here\n## 0 Zero Card",
    );
  });

  it("groups by kind: not_found first, then malformed", () => {
    const entries: DeckListInvalidEntry[] = [
      { kind: "malformed", text: "bad line" },
      { kind: "not_found", text: "Unknown Card" },
      { kind: "malformed", text: "another bad" },
    ];
    expect(formatInvalidEntriesComment(entries)).toBe(
      "# NOT FOUND\n## Unknown Card\n# MALFORMED\n## bad line\n## another bad",
    );
  });

  it("does not include lineNumber in output (text only)", () => {
    const entries: DeckListInvalidEntry[] = [
      { kind: "not_found", text: "Card Name", lineNumber: 5 },
    ];
    expect(formatInvalidEntriesComment(entries)).toBe("# NOT FOUND\n## Card Name");
  });
});
