import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { arielSingingMermaid } from "./015-ariel-singing-mermaid";

describe("Ariel - Singing Mermaid", () => {
  it("should have Singer 7 ability", () => {
    expect(hasKeyword(arielSingingMermaid, "Singer")).toBe(true);
  });
});
