/**
 * Keyword Dictionary
 *
 * Maps English Lorcana keyword names to their locale-specific translations.
 * Used to split localized card text into structured CardTextEntry[] by
 * recognizing keyword boundaries that the generic parser cannot detect.
 *
 * Sources: Ravensburger localization data (localization-{de,fr,it}.json)
 */

import type { Languages } from "@tcg/lorcana-types";

/**
 * Simple keywords: exact string match (case-insensitive).
 * Keys are the English keyword names from the game engine.
 */
const SIMPLE_KEYWORD_TRANSLATIONS: Record<string, Record<Languages, string>> = {
  Alert: { en: "Alert", de: "Alarmiert", fr: "Agilité", it: "Vigile" },
  Bodyguard: { en: "Bodyguard", de: "Beschützen", fr: "Rempart", it: "Guardiano" },
  Evasive: { en: "Evasive", de: "Wendig", fr: "Insaisissable", it: "Sfuggente" },
  Reckless: { en: "Reckless", de: "Impulsiv", fr: "Combattant", it: "Attaccabrighe" },
  Rush: { en: "Rush", de: "Rasant", fr: "Charge", it: "Lesto" },
  Support: { en: "Support", de: "Unterstützen", fr: "Soutien", it: "Aiutante" },
  Vanish: { en: "Vanish", de: "Verschwinden", fr: "Dissipation", it: "Svanire" },
  Ward: { en: "Ward", de: "Behütet", fr: "Hors d'atteinte", it: "Protetto" },
};

/**
 * Parameterized keywords: matched by prefix + number (e.g. "Challenger +3", "Resist +2").
 */
const PARAMETERIZED_KEYWORD_TRANSLATIONS: Record<string, Record<Languages, string>> = {
  Challenger: { en: "Challenger", de: "Herausfordern", fr: "Offensif", it: "Sfidante" },
  Resist: { en: "Resist", de: "Robust", fr: "Résistance", it: "Resistere" },
};

/**
 * Complex keywords with a trailing number (e.g. "Shift 5", "Singer 3").
 */
const COMPLEX_KEYWORD_TRANSLATIONS: Record<string, Record<Languages, string>> = {
  Boost: { en: "Boost", de: "Stärken", fr: "Boost", it: "Potenziamento" },
  Shift: { en: "Shift", de: "Gestaltwandel", fr: "Alter", it: "Trasformazione" },
  Singer: { en: "Singer", de: "Singen", fr: "Mélomane", it: "Melodioso" },
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface KeywordMatch {
  /** The matched keyword text (e.g. "Wendig", "Gestaltwandel 5") */
  text: string;
  /** Number of characters consumed from the input */
  length: number;
}

/**
 * Check if a string is entirely uppercase letters (ignoring non-letter chars).
 * ALL-CAPS words are ability names, not keywords.
 * Keywords appear in natural case: "Evasive", "Wendig", "Insaisissable".
 * Ability names appear in ALL CAPS: "DISAPPEAR", "VERSCHWINDEN".
 */
function isAllUpperCase(str: string): boolean {
  const letters = str.replace(/[^\p{L}]/gu, "");
  return letters.length >= 2 && /\p{Lu}/u.test(letters) && !/\p{Ll}/u.test(letters);
}

/**
 * Try to match a keyword at the start of the given text for a specific locale.
 * Returns the matched keyword text and its length, or null if no match.
 *
 * Rejects ALL-CAPS matches for simple keywords because those are ability names,
 * not keyword references. Keywords appear in their natural/title case on cards.
 */
export function matchKeywordAtStart(text: string, locale: Languages): KeywordMatch | null {
  const trimmed = text.trimStart();
  const leadingOffset = text.length - trimmed.length;

  // Try complex keywords first (longest match: "Gestaltwandel 5")
  for (const translations of Object.values(COMPLEX_KEYWORD_TRANSLATIONS)) {
    const localeName = translations[locale];
    const pattern = new RegExp(`^${escapeRegex(localeName)} \\d+`, "i");
    const match = trimmed.match(pattern);
    if (match && !isAllUpperCase(match[0])) {
      return { text: match[0], length: leadingOffset + match[0].length };
    }
  }

  // Try parameterized keywords ("Herausfordern +3")
  for (const translations of Object.values(PARAMETERIZED_KEYWORD_TRANSLATIONS)) {
    const localeName = translations[locale];
    const pattern = new RegExp(`^${escapeRegex(localeName)} \\+\\d+`, "i");
    const match = trimmed.match(pattern);
    if (match && !isAllUpperCase(match[0])) {
      return { text: match[0], length: leadingOffset + match[0].length };
    }
  }

  // Try simple keywords (exact word boundary)
  for (const translations of Object.values(SIMPLE_KEYWORD_TRANSLATIONS)) {
    const localeName = translations[locale];
    const pattern = new RegExp(`^${escapeRegex(localeName)}(?=\\s|$)`, "i");
    const match = trimmed.match(pattern);
    if (match && !isAllUpperCase(match[0])) {
      return { text: match[0], length: leadingOffset + match[0].length };
    }
  }

  return null;
}

/**
 * Strip all leading keywords from localized text, returning them as separate entries.
 *
 * Given text like "Wendig VERSCHWINDEN Wenn du diesen..." with locale "de",
 * returns:
 *   keywords: [{ title: "Wendig" }]
 *   remainder: "VERSCHWINDEN Wenn du diesen..."
 */
export function stripLeadingKeywords(
  text: string,
  locale: Languages,
  expectedKeywordCount: number,
): { keywords: Array<{ title: string }>; remainder: string } {
  const keywords: Array<{ title: string }> = [];
  let remaining = text;
  for (let stripped = 0; stripped < expectedKeywordCount; stripped += 1) {
    const match = matchKeywordAtStart(remaining, locale);
    if (!match) break;

    keywords.push({ title: match.text });
    remaining = remaining.slice(match.length).trimStart();

    // Skip any trailing parenthetical reminder text (e.g. "(You may pay 5 to play...)")
    // that was not stripped during localization generation.
    remaining = skipLeadingReminderText(remaining);

    // Skip leading comma/semicolon separators (some locales use ", " between keywords)
    remaining = remaining.replace(/^[,;]\s*/, "");
  }

  return { keywords, remainder: remaining };
}

/**
 * Strip trailing keywords from the end of localized text.
 *
 * Given text like "UNDERDOG Falls dies dein... Singen 3 (reminder text)" with locale "de",
 * returns:
 *   trailingKeywords: [{ title: "Singen 3" }]
 *   textBeforeTrailing: "UNDERDOG Falls dies dein..."
 */
export function stripTrailingKeywords(
  text: string,
  locale: Languages,
  expectedCount: number,
): { trailingKeywords: Array<{ title: string }>; textBeforeTrailing: string } {
  const trailingKeywords: Array<{ title: string }> = [];
  let remaining = text.trimEnd();

  for (let stripped = 0; stripped < expectedCount; stripped += 1) {
    // Strip trailing reminder text first
    remaining = skipTrailingReminderText(remaining);
    // Strip trailing comma/semicolons
    remaining = remaining.replace(/[,;]\s*$/, "").trimEnd();

    const match = matchKeywordAtEnd(remaining, locale);
    if (!match) break;

    trailingKeywords.unshift({ title: match.text });
    remaining = remaining.slice(0, remaining.length - match.length).trimEnd();
  }

  return { trailingKeywords, textBeforeTrailing: remaining };
}

/**
 * Try to match a keyword at the end of the given text.
 */
function matchKeywordAtEnd(text: string, locale: Languages): KeywordMatch | null {
  const trimmed = text.trimEnd();

  // Try complex keywords (e.g. "Singen 3" at end)
  for (const translations of Object.values(COMPLEX_KEYWORD_TRANSLATIONS)) {
    const localeName = translations[locale];
    const pattern = new RegExp(`(?:^|\\s)(${escapeRegex(localeName)} \\d+)$`, "i");
    const match = trimmed.match(pattern);
    if (match?.[1] && !isAllUpperCase(match[1])) {
      return { text: match[1], length: match[1].length };
    }
  }

  // Try parameterized keywords (e.g. "Herausfordern +3" at end)
  for (const translations of Object.values(PARAMETERIZED_KEYWORD_TRANSLATIONS)) {
    const localeName = translations[locale];
    const pattern = new RegExp(`(?:^|\\s)(${escapeRegex(localeName)} \\+\\d+)$`, "i");
    const match = trimmed.match(pattern);
    if (match?.[1] && !isAllUpperCase(match[1])) {
      return { text: match[1], length: match[1].length };
    }
  }

  // Try simple keywords (e.g. "Wendig" at end)
  for (const translations of Object.values(SIMPLE_KEYWORD_TRANSLATIONS)) {
    const localeName = translations[locale];
    const pattern = new RegExp(`(?:^|\\s)(${escapeRegex(localeName)})$`, "i");
    const match = trimmed.match(pattern);
    if (match?.[1] && !isAllUpperCase(match[1])) {
      return { text: match[1], length: match[1].length };
    }
  }

  return null;
}

/**
 * Skip a leading parenthetical block if it looks like reminder text.
 * Reminder text is enclosed in () and typically explains a keyword's rules.
 */
function skipLeadingReminderText(text: string): string {
  if (!text.startsWith("(")) return text;

  // Find the matching closing parenthesis
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")") {
      depth--;
      if (depth === 0) {
        return text.slice(i + 1).trimStart();
      }
    }
  }

  // Unmatched parenthesis — don't skip
  return text;
}

/**
 * Skip a trailing parenthetical block (reminder text at end of string).
 */
function skipTrailingReminderText(text: string): string {
  const trimmed = text.trimEnd();
  if (!trimmed.endsWith(")")) return text;

  // Find the matching opening parenthesis from the end
  let depth = 0;
  for (let i = trimmed.length - 1; i >= 0; i--) {
    if (trimmed[i] === ")") depth++;
    else if (trimmed[i] === "(") {
      depth--;
      if (depth === 0) {
        return trimmed.slice(0, i).trimEnd();
      }
    }
  }

  return text;
}
