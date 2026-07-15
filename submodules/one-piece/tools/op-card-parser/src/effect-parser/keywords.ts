import type { Keyword } from "@tcg/op-types";
import { KEYWORD_BRACKET_TO_TYPE, KEYWORD_REFERENCE_PREFIX } from "./constants.ts";

export function parseKeywords(text: string): Keyword[] {
  const keywords = new Set<Keyword>();
  const bracketRe = /\[([^\]]+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = bracketRe.exec(text)) !== null) {
    const content = match[1]!.trim().toLowerCase();
    const kw = KEYWORD_BRACKET_TO_TYPE[content];
    if (!kw) continue;
    // Skip if preceded by reference context ("a card with a [Blocker]")
    const before = text.slice(0, match.index);
    if (KEYWORD_REFERENCE_PREFIX.test(before)) continue;
    keywords.add(kw);
  }
  return [...keywords];
}
