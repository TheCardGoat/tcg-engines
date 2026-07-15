import type { AbilityDefinition } from "@tcg/lorcana-types";
import type { NormalizedTextEntry } from "./types";
import { KNOWN_KEYWORD_PATTERNS } from "./types";
import { collectAbilitySignals } from "./signals";
import { normalizeCardTextContent } from "./utils";

export function hasDirectAbilityMatch(
  entry: NormalizedTextEntry,
  abilities: AbilityDefinition[] | undefined,
): boolean {
  if (!abilities?.length) {
    return false;
  }

  const normalizedTitle = entry.title.trim().toLowerCase();
  if (!normalizedTitle) {
    return false;
  }

  const normalizedFullText = entry.fullText.trim().toLowerCase();

  return abilities.some((ability) => {
    const abilityName = normalizeCardTextContent(ability.name ?? "")
      .trim()
      .toLowerCase();
    const abilityText = normalizeCardTextContent(ability.text ?? "")
      .trim()
      .toLowerCase();

    return (
      abilityName === normalizedTitle ||
      abilityName.startsWith(`${normalizedTitle} `) ||
      abilityText === normalizedFullText ||
      abilityText.startsWith(`${normalizedTitle} `)
    );
  });
}

export function hasCompositeKeywordGrantMatch(
  entry: NormalizedTextEntry,
  abilities: AbilityDefinition[] | undefined,
): boolean {
  if (!abilities?.length) {
    return false;
  }

  const entrySignals = collectAbilitySignals(abilities);
  if (
    !entrySignals.hasKeywordGrantSupport ||
    !abilities.every(
      (ability) =>
        ability.type === "static" &&
        !normalizeCardTextContent(ability.name ?? "").trim() &&
        !normalizeCardTextContent(ability.text ?? "").trim(),
    )
  ) {
    return false;
  }

  const mentionedKeywords = KNOWN_KEYWORD_PATTERNS.filter(
    ({ keyword, pattern }) =>
      pattern.test(entry.fullText) ||
      new RegExp(
        `\\bgain(?:s)?\\b[\\s\\S]*\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i",
      ).test(entry.fullText),
  ).map(({ keyword }) => keyword);

  return (
    mentionedKeywords.length >= 2 &&
    mentionedKeywords.every((keyword) => entrySignals.grantedKeywords.includes(keyword))
  );
}

export function getRelevantAbilitiesForEntry(
  entry: NormalizedTextEntry,
  abilities: AbilityDefinition[] | undefined,
): AbilityDefinition[] | undefined {
  if (!abilities?.length) {
    return abilities;
  }

  const normalizedTitle = entry.title.trim().toLowerCase();
  if (!normalizedTitle) {
    return abilities;
  }

  const relevant = abilities.filter((ability) => {
    const abilityName = normalizeCardTextContent(ability.name ?? "")
      .trim()
      .toLowerCase();
    const abilityText = normalizeCardTextContent(ability.text ?? "")
      .trim()
      .toLowerCase();
    const normalizedFullText = entry.fullText.trim().toLowerCase();

    return (
      abilityName === normalizedTitle ||
      abilityName.startsWith(`${normalizedTitle} `) ||
      abilityText === normalizedFullText ||
      abilityText.startsWith(`${normalizedTitle} `)
    );
  });

  return relevant.length > 0 ? relevant : abilities;
}
