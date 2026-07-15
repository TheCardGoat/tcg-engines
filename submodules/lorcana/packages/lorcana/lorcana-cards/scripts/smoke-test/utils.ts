import type { AbilityDefinition, CardText, CardTextEntry } from "@tcg/lorcana-types";
import { normalizeCardTextContent } from "../utils/structured-card-text";
import type {
  LorcanaCard,
  NormalizedTextEntry,
  RecursiveObject,
  RecursiveValue,
  SuspectedTitleSplit,
} from "./types";
import {
  CARD_DIRECTORY_BY_TYPE,
  PLAIN_TEXT_TITLE_PATTERN,
  SPLIT_TITLE_CONTINUATION_PATTERN,
} from "./types";

export function isRecursiveObject(value: RecursiveValue): value is RecursiveObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function visitRecursive(
  value: RecursiveValue,
  visitor: (node: RecursiveObject) => void,
): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      visitRecursive(item, visitor);
    }
    return;
  }

  if (!isRecursiveObject(value)) {
    return;
  }

  visitor(value);

  for (const nested of Object.values(value)) {
    visitRecursive(nested, visitor);
  }
}

export function padCardNumber(cardNumber: number): string {
  return String(cardNumber).padStart(3, "0");
}

export function getCardDisplayName(card: LorcanaCard): string {
  return card.version ? `${card.name} - ${card.version}` : card.name;
}

export function getSetCardNumber(card: LorcanaCard): string {
  return `${card.set}/${padCardNumber(card.cardNumber)}`;
}

export function normalizeEntry(title: string, description?: string): NormalizedTextEntry {
  const normalizedTitle = normalizeCardTextContent(title).trim();
  const normalizedDescription = normalizeCardTextContent(description ?? "").trim();
  const signalText = normalizedDescription || normalizedTitle;
  const fullText = normalizedDescription
    ? `${normalizedTitle} ${normalizedDescription}`.trim()
    : normalizedTitle;

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    signalText,
    fullText,
  };
}

export function flattenPlainText(text: string): NormalizedTextEntry[] {
  return normalizeCardTextContent(text)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const match = PLAIN_TEXT_TITLE_PATTERN.exec(segment);
      if (!match?.groups) {
        return normalizeEntry(segment);
      }

      return normalizeEntry(match.groups.title, match.groups.description);
    });
}

export function toTextEntries(cardText: CardText | undefined): NormalizedTextEntry[] {
  if (!cardText) return [];
  if (typeof cardText === "string") return flattenPlainText(cardText);

  return cardText.map((entry: CardTextEntry) => normalizeEntry(entry.title, entry.description));
}

export function normalizeTextFingerprint(cardText: CardText | undefined): string {
  return toTextEntries(cardText)
    .map((entry) => entry.fullText)
    .join(" / ");
}

export function hasMatchingAbilityText(
  abilities: AbilityDefinition[] | undefined,
  reconstructedTitle: string,
  reconstructedFullText: string,
): boolean {
  if (!abilities?.length) {
    return false;
  }

  const normalizedReconstructedTitle = normalizeCardTextContent(reconstructedTitle)
    .trim()
    .toLowerCase();
  const normalizedReconstructedFullText = normalizeCardTextContent(reconstructedFullText)
    .trim()
    .toLowerCase();

  return abilities.some((ability) => {
    const abilityName = normalizeCardTextContent(ability.name ?? "")
      .trim()
      .toLowerCase();
    const abilityText = normalizeCardTextContent(ability.text ?? "")
      .trim()
      .toLowerCase();

    return (
      abilityName === normalizedReconstructedTitle ||
      abilityText === normalizedReconstructedFullText ||
      abilityText.startsWith(`${normalizedReconstructedTitle} `)
    );
  });
}

export function detectMalformedTitleDescriptionSplit(
  entry: NormalizedTextEntry,
  abilities: AbilityDefinition[] | undefined,
): SuspectedTitleSplit | null {
  if (!entry.title || !entry.description || !abilities?.length) {
    return null;
  }

  const splitMatch = SPLIT_TITLE_CONTINUATION_PATTERN.exec(entry.description);
  if (!splitMatch?.groups) {
    return null;
  }

  const reconstructedTitle = `${entry.title} ${splitMatch.groups.titleContinuation}`.trim();
  const reconstructedDescription = splitMatch.groups.description.trim();
  const reconstructedFullText = `${reconstructedTitle} ${reconstructedDescription}`.trim();

  if (!hasMatchingAbilityText(abilities, reconstructedTitle, reconstructedFullText)) {
    return null;
  }

  return {
    reconstructedTitle,
    reconstructedDescription,
    reconstructedFullText,
  };
}

export function detectAdjacentTitleOnlySplit(
  textEntries: NormalizedTextEntry[],
  entryIndex: number,
  abilities: AbilityDefinition[] | undefined,
): SuspectedTitleSplit | null {
  const entry = textEntries[entryIndex];
  const previousEntry = textEntries[entryIndex - 1];

  if (
    !previousEntry ||
    previousEntry.description ||
    !previousEntry.title ||
    !entry.description ||
    !entry.title
  ) {
    return null;
  }

  const reconstructedTitle = `${previousEntry.title} ${entry.title}`.trim();
  const reconstructedDescription = entry.description;
  const reconstructedFullText = `${reconstructedTitle} ${reconstructedDescription}`.trim();

  if (!hasMatchingAbilityText(abilities, reconstructedTitle, reconstructedFullText)) {
    return null;
  }

  return {
    reconstructedTitle,
    reconstructedDescription,
    reconstructedFullText,
  };
}

export function getCardFilePath(card: LorcanaCard, filePaths: Map<string, string>): string {
  const key = `${card.set}|${CARD_DIRECTORY_BY_TYPE[card.cardType]}|${padCardNumber(card.cardNumber)}`;
  return filePaths.get(key) ?? "";
}

export { normalizeCardTextContent };
