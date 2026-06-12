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

export type Token =
  | { type: "text"; value: string }
  | { type: "symbol"; file: string; code: string };

export function tokenizeTextWithSymbols(raw: string | undefined): Token[] {
  if (!raw) return [];
  const tokens: Token[] = [];
  let lastIndex = 0;

  for (const match of raw.matchAll(SYMBOL_PATTERN)) {
    const [fullMatch, code] = match;
    const start = match.index ?? 0;
    const file = SYMBOLS[code.toUpperCase()];

    if (start > lastIndex) {
      tokens.push({ type: "text", value: raw.slice(lastIndex, start) });
    }

    if (file) {
      tokens.push({ type: "symbol", file, code: code.toUpperCase() });
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
