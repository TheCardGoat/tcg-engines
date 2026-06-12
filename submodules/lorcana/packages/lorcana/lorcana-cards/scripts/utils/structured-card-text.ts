import type { CardText, CardTextEntry } from "@tcg/lorcana-types";

const EFFECT_WORDS = [
  "When",
  "Whenever",
  "At",
  "During",
  "While",
  "If",
  "Your",
  "This",
  "Each",
  "Chosen",
  "Choose",
  "Deal",
  "Draw",
  "Banish",
  "Return",
  "Put",
  "Ready",
  "Move",
  "Gain",
  "Pay",
  "Look",
  "Reveal",
  "Shuffle",
  "Remove",
  "Play",
  "You",
];

const EFFECT_WORD_PATTERN = new RegExp(`\\b(?:${EFFECT_WORDS.join("|")})\\b`, "g");
const ACTIVATED_SEPARATOR_PATTERN =
  /^(?<title>[A-Z0-9][A-Z0-9'",.!?&/:;+-]*(?: [A-Z0-9][A-Z0-9'",.!?&/:;+-]*)*)(?<description> .*(?:—|–| - ).+)$/;
const SINGLE_QUOTE_VARIANTS = /[’‘‛ʼ]/g;
const DOUBLE_QUOTE_VARIANTS = /[“”„‟]/g;
const DASH_SEPARATOR_VARIANTS = /[ \t]+(?:—|–|―|−|-)[ \t]+/g;
const ELLIPSIS_VARIANTS = /…/g;
const NON_BREAKING_SPACES = /\u00a0/g;

export function normalizeCardTextContent(text: string): string {
  return text
    .replace(NON_BREAKING_SPACES, " ")
    .replace(SINGLE_QUOTE_VARIANTS, "'")
    .replace(DOUBLE_QUOTE_VARIANTS, '"')
    .replace(DASH_SEPARATOR_VARIANTS, " — ")
    .replace(ELLIPSIS_VARIANTS, "...");
}

export function normalizeCardTextEntries(entries: CardTextEntry[]): CardTextEntry[] {
  return entries.map((entry) => ({
    title: normalizeCardTextContent(entry.title),
    ...(entry.description ? { description: normalizeCardTextContent(entry.description) } : {}),
  }));
}

export function shouldUsePlainStringCardText(entries: CardTextEntry[]): boolean {
  return entries.length === 1 && !entries[0]?.description;
}

export function cardTextEntriesToCardText(entries: CardTextEntry[]): CardText {
  if (entries.length === 0) return "";
  if (shouldUsePlainStringCardText(entries)) {
    return entries[0]!.title;
  }
  return entries;
}

function buildLogicalSegments(text: string): string[] {
  const lines = text
    .replace(/\r\n?/g, "\n")
    .replace(/%/g, "\n") // Ravensburger uses % as ability separator
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const segments: string[] = [];
  let currentSegment = "";

  for (const line of lines) {
    if (line.startsWith("- ") && currentSegment) {
      currentSegment = `${currentSegment}\n${line}`;
      continue;
    }

    if (currentSegment) {
      segments.push(currentSegment);
    }

    currentSegment = line;
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments;
}

function isLikelyAllCapsTitle(prefix: string): boolean {
  return (
    /[A-Z]/.test(prefix) &&
    !/[a-z]/.test(prefix) &&
    !/[{}]/.test(prefix) &&
    !prefix.includes("—") &&
    !prefix.includes("–") &&
    !prefix.includes(" - ")
  );
}

function isLikelyStandaloneTitlePrefix(prefix: string): boolean {
  return (
    /^[A-Z][A-Za-z0-9+{}'/-]*(?: [A-Z0-9{][A-Za-z0-9+{}'/-]*)*$/.test(prefix) &&
    !/[,:;.!?]/.test(prefix)
  );
}

function isLikelyAllCapsWord(token: string): boolean {
  const lettersOnly = token.trim().replace(/[^\p{L}]/gu, "");

  if (lettersOnly.length < 2) return false;

  return /\p{Lu}/u.test(lettersOnly) && !/\p{Ll}/u.test(lettersOnly);
}

function startsSentenceBoundary(previousToken: string | undefined): boolean {
  if (!previousToken) return true;
  if (/^\d+$/.test(previousToken)) return true;

  return /[.!?]["')\]]*$/.test(previousToken);
}

function splitNamedAbilitySegments(segment: string): string[] {
  const parts = segment.split(/(\s+)/);
  const words = parts
    .map((part, index) => ({ part, index }))
    .filter(({ part }) => part.trim().length > 0);
  const startIndexes: number[] = [];

  for (let cursor = 0; cursor < words.length; cursor++) {
    const currentWord = words[cursor]!;
    const previousWord = cursor > 0 ? words[cursor - 1]!.part : undefined;

    if (!isLikelyAllCapsWord(currentWord.part) || !startsSentenceBoundary(previousWord)) {
      continue;
    }

    let titleEnd = cursor;
    for (; titleEnd < words.length && isLikelyAllCapsWord(words[titleEnd]!.part); titleEnd += 1) {}

    if (titleEnd >= words.length) {
      continue;
    }

    const hasLowercaseAhead = words
      .slice(titleEnd, titleEnd + 3)
      .some((w) => /\p{Ll}/u.test(w.part));
    if (!hasLowercaseAhead) {
      continue;
    }

    startIndexes.push(currentWord.index);
  }

  if (startIndexes.length === 0) {
    return [segment];
  }

  if (startIndexes[0] === 0 && startIndexes.length <= 1) {
    return [segment];
  }

  const result: string[] = [];

  if (startIndexes[0]! !== 0) {
    result.push(parts.slice(0, startIndexes[0]!).join("").trim());
  }

  for (let i = 0; i < startIndexes.length; i++) {
    const start = startIndexes[i]!;
    const end = i + 1 < startIndexes.length ? startIndexes[i + 1]! : parts.length;
    result.push(parts.slice(start, end).join("").trim());
  }

  return result.filter(Boolean);
}

function splitAtUppercaseRun(segment: string): CardTextEntry | null {
  const words = segment.split(/\s+/).filter(Boolean);

  if (words.length < 2 || !isLikelyAllCapsWord(words[0]!)) {
    return null;
  }

  let titleEnd = 0;
  for (; titleEnd < words.length && isLikelyAllCapsWord(words[titleEnd]!); titleEnd += 1) {}

  if (titleEnd <= 0 || titleEnd >= words.length) {
    return null;
  }

  const description = words.slice(titleEnd).join(" ").trim();

  if (!description || !/\p{Ll}/u.test(description)) {
    return null;
  }

  return {
    title: words.slice(0, titleEnd).join(" "),
    description,
  };
}

function splitAtParenthetical(segment: string): CardTextEntry | null {
  const firstParenthetical = segment.indexOf("(");
  if (firstParenthetical <= 0) return null;

  const title = segment.slice(0, firstParenthetical).trimEnd();
  const description = segment.slice(firstParenthetical).trimStart();

  if (!title || !description || !isLikelyStandaloneTitlePrefix(title)) return null;

  return { title, description };
}

function splitAtEffectWord(segment: string): CardTextEntry | null {
  for (const match of segment.matchAll(EFFECT_WORD_PATTERN)) {
    const index = match.index ?? -1;

    if (index <= 0) continue;

    const title = segment.slice(0, index).trimEnd();
    const description = segment.slice(index).trimStart();

    if (!title || !description || !isLikelyAllCapsTitle(title)) {
      continue;
    }

    return { title, description };
  }

  return null;
}

function splitAtBackslashTitle(segment: string): CardTextEntry | null {
  // Handles Ravensburger's \Title\ description format (backslash delimiters, mixed case)
  const match = segment.match(/^\\(.+?)\\ (.+)$/s);
  if (!match) return null;
  return { title: match[1]!.trim(), description: match[2]!.trim() };
}

function splitAtActivatedSeparator(segment: string): CardTextEntry | null {
  const match = segment.match(ACTIVATED_SEPARATOR_PATTERN);

  if (!match?.groups) return null;

  const title = match.groups.title.trim();
  const description = match.groups.description.trimStart();

  if (!title || !description || !isLikelyAllCapsTitle(title)) {
    return null;
  }

  return { title, description };
}

function splitSegment(segment: string): CardTextEntry {
  if (segment.includes("\n")) {
    return { title: segment };
  }

  return (
    splitAtBackslashTitle(segment) ??
    splitAtParenthetical(segment) ??
    splitAtActivatedSeparator(segment) ??
    splitAtUppercaseRun(segment) ??
    splitAtEffectWord(segment) ?? { title: segment }
  );
}

export function splitCardTextToEntries(text: string): CardTextEntry[] {
  const normalizedText = text.replace(/\r\n?/g, "\n").trim();

  if (!normalizedText) return [];

  return buildLogicalSegments(normalizedText).flatMap(splitNamedAbilitySegments).map(splitSegment);
}

export function splitCardText(text: string): CardText {
  const normalizedText = normalizeCardTextContent(text).trim();

  if (!normalizedText) {
    return "";
  }

  const entries = normalizeCardTextEntries(splitCardTextToEntries(normalizedText));
  return cardTextEntriesToCardText(entries);
}
