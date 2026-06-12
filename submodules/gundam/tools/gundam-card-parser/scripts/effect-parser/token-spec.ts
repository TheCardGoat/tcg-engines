import type { KeywordEffectEntry, TokenSpec } from "@tcg/gundam-types";
import { parseKeywordEffectName } from "./helpers.ts";

/**
 * Parse an inline token definition: [Gundam]((White Base Team)·AP3·HP3)
 * Supports nested parentheses for traits inside the spec.
 */
export function parseTokenSpec(tokenText: string): TokenSpec | undefined {
  // Support nested parens: [Name]((Trait)·AP3·HP3) — the outer parens wrap the spec
  const m = tokenText.match(/\[([^\]]+)\]\(([^()]*(?:\([^)]*\)[^()]*)*)\)/);
  if (!m) return undefined;
  const name = m[1].trim();
  const inner = m[2]; // "(White Base Team)·AP3·HP3·<Blocker>"
  const traits: string[] = [];
  const keywordEffects: KeywordEffectEntry[] = [];
  let ap = 0;
  let hp = 0;
  let deployState: "active" | "rested" = "active";

  // Extract nested trait parens
  const traitMatches = inner.matchAll(/\(([^)]+)\)/g);
  for (const tm of traitMatches) traits.push(tm[1].toLowerCase());

  // Extract AP/HP
  const apM = inner.match(/AP(\d+)/);
  if (apM) ap = parseInt(apM[1]);
  const hpM = inner.match(/HP(\d+)/);
  if (hpM) hp = parseInt(hpM[1]);

  // Extract keyword effects (optional numeric value: <Breach 3>)
  const kwMatches = inner.matchAll(/<([\w\s-]+?)(?:\s+(\d+))?>/g);
  for (const km of kwMatches) {
    const kw = parseKeywordEffectName(km[1]);
    if (!kw) continue;
    keywordEffects.push(km[2] ? { keyword: kw, value: parseInt(km[2], 10) } : { keyword: kw });
  }

  // Deploy state
  if (/rested/i.test(tokenText)) deployState = "rested";

  return {
    name,
    traits,
    ap,
    hp,
    ...(keywordEffects.length > 0 ? { keywordEffects } : {}),
    deployState,
  };
}
