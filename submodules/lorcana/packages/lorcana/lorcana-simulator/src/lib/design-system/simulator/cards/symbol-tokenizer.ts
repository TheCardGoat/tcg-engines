import { buildSimulatorAssetUrl } from "$lib/config/public-url-config.js";

export const SYMBOL_BASE_URL = buildSimulatorAssetUrl("symbols");

export const SYMBOLS: Record<string, string> = {
  E: "exert.svg",
  W: "willpower-2.svg",
  L: "lore-2.svg",
  S: "strength-simple-2.svg",
  I: "ink-simple-2.svg",
};

export const SYMBOL_PATTERN = /\{([EWLSI])\}/gi;
export const CARD_TEXT_TOKEN_PATTERN = /\{([EWLSI])\}|<([^<>\n]+)>/gi;

export type Token =
  | { type: "text"; value: string }
  | { type: "symbol"; file: string; code: string }
  | { type: "keyword"; value: string };

export function tokenizeTextWithSymbols(raw: string | undefined): Token[] {
  if (!raw) return [];
  const tokens: Token[] = [];
  let lastIndex = 0;

  for (const match of raw.matchAll(CARD_TEXT_TOKEN_PATTERN)) {
    const [fullMatch, symbolCode, keywordText] = match;
    const start = match.index ?? 0;

    if (start > lastIndex) {
      tokens.push({ type: "text", value: raw.slice(lastIndex, start) });
    }

    if (symbolCode) {
      const code = symbolCode.toUpperCase();
      const file = SYMBOLS[code];

      if (file) {
        tokens.push({ type: "symbol", file, code });
      } else {
        tokens.push({ type: "text", value: fullMatch });
      }
    } else if (keywordText?.trim()) {
      tokens.push({ type: "keyword", value: keywordText.trim() });
    } else {
      tokens.push({ type: "text", value: fullMatch });
    }

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < raw.length) {
    tokens.push({ type: "text", value: raw.slice(lastIndex) });
  }

  return tokens;
}
