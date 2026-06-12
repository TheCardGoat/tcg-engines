import * as fs from "node:fs";
import * as path from "node:path";
import type {
  AbilitySummary,
  CliOptions,
  Finding,
  FindingCategory,
  LorcanaCard,
  Severity,
  Summary,
} from "./types";
import { CARDS_ROOT, CARD_DIRECTORY_BY_TYPE, SEVERITY_ORDER } from "./types";
import {
  collectAbilitySignals,
  summarizeAbilityForExpected,
  summarizeAbilityForParity,
  summarizeSignals,
} from "./signals";
import {
  classifyActivatedFindingCategory,
  classifyTriggerFindingCategory,
  detectKeywordGrant,
  isActivatedLikeText,
  isCostReductionText,
  isGameplayAbilityLikeText,
  isLikelyEntryAlignmentNoise,
  isReplacementLikeText,
  isWrongActionFamily,
  startsWithTriggerSignal,
} from "./text-detection";
import {
  hasExpectedTriggerClauseParity,
  hasExpectedTriggerSubjectParity,
  inferExpectedTriggerClauses,
  inferExpectedTriggerSubjects,
  supportsCostReductionText,
  supportsKeywordGrantText,
  supportsTriggerLikeText,
} from "./trigger-analysis";
import {
  hasCompositeKeywordGrantMatch,
  hasDirectAbilityMatch,
  getRelevantAbilitiesForEntry,
} from "./entry-analysis";
import {
  detectAdjacentTitleOnlySplit,
  detectMalformedTitleDescriptionSplit,
  getCardDisplayName,
  getCardFilePath,
  getSetCardNumber,
  normalizeTextFingerprint,
  padCardNumber,
  toTextEntries,
} from "./utils";
import { normalizeCardTextContent } from "../utils/structured-card-text";

export function makeFinding(
  card: LorcanaCard,
  filePath: string,
  category: FindingCategory,
  severity: Severity,
  textSnippet: string,
  expectedSignal: string,
  observedSignal: string,
  whySuspicious: string,
): Finding {
  return {
    severity,
    category,
    cardName: getCardDisplayName(card),
    canonicalId: card.canonicalId,
    setCardNumber: getSetCardNumber(card),
    filePath,
    textSnippet,
    expectedSignal,
    observedSignal,
    whySuspicious,
  };
}

export function collectCardFilePaths(): Map<string, string> {
  const output = new Map<string, string>();

  for (const entry of fs.readdirSync(CARDS_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^\d{3}$/.test(entry.name)) continue;

    const setCode = entry.name;

    for (const kindDirectory of Object.values(CARD_DIRECTORY_BY_TYPE)) {
      const directoryPath = path.join(CARDS_ROOT, setCode, kindDirectory);
      if (!fs.existsSync(directoryPath)) continue;

      for (const fileName of fs.readdirSync(directoryPath)) {
        if (!/^\d{3}-.*\.ts$/.test(fileName)) continue;
        if (
          fileName.endsWith(".test.ts") ||
          fileName.endsWith(".spec.ts") ||
          fileName.endsWith(".i18n.ts")
        ) {
          continue;
        }

        const cardNumber = fileName.slice(0, 3);
        output.set(`${setCode}|${kindDirectory}|${cardNumber}`, path.join(directoryPath, fileName));
      }
    }
  }

  return output;
}

function compareList(label: string, left: string[], right: string[]): string[] {
  const leftValue = left.join(", ");
  const rightValue = right.join(", ");

  if (leftValue === rightValue) {
    return [];
  }

  return [`${label} differs (${leftValue || "none"} vs ${rightValue || "none"})`];
}

function compareParitySummary(left: AbilitySummary, right: AbilitySummary): string[] {
  const mismatches: string[] = [];

  if (left.abilityCount !== right.abilityCount) {
    mismatches.push(`ability count differs (${left.abilityCount} vs ${right.abilityCount})`);
  }

  mismatches.push(...compareList("top-level types", left.topLevelTypes, right.topLevelTypes));
  mismatches.push(...compareList("trigger events", left.triggerEvents, right.triggerEvents));
  mismatches.push(...compareList("effect families", left.effectFamilies, right.effectFamilies));
  mismatches.push(...compareList("keywords", left.keywords, right.keywords));

  return mismatches;
}

function getParitySeverity(left: AbilitySummary, right: AbilitySummary): Severity {
  if (left.abilityCount === 0 || right.abilityCount === 0) {
    return "high";
  }

  if (left.abilityCount !== right.abilityCount) {
    return "high";
  }

  const topLevelTypes = left.topLevelTypes.join(",");
  const otherTopLevelTypes = right.topLevelTypes.join(",");
  if (topLevelTypes !== otherTopLevelTypes) {
    return "high";
  }

  const triggers = left.triggerEvents.join(",");
  const otherTriggers = right.triggerEvents.join(",");
  if (triggers !== otherTriggers) {
    return "medium";
  }

  return "medium";
}

function dedupeFindings(findings: Finding[]): Finding[] {
  const deduped = new Map<string, Finding>();

  for (const finding of findings) {
    const key = [
      finding.category,
      finding.canonicalId,
      normalizeCardTextContent(finding.textSnippet),
    ].join("|");

    const existing = deduped.get(key);
    if (!existing) {
      deduped.set(key, finding);
      continue;
    }

    const existingSeverityOrder = SEVERITY_ORDER[existing.severity];
    const nextSeverityOrder = SEVERITY_ORDER[finding.severity];
    if (nextSeverityOrder < existingSeverityOrder) {
      deduped.set(key, finding);
      continue;
    }

    if (nextSeverityOrder === existingSeverityOrder) {
      const existingSetOrder = existing.setCardNumber.localeCompare(finding.setCardNumber);
      if (existingSetOrder > 0) {
        deduped.set(key, finding);
      }
    }
  }

  return [...deduped.values()];
}

export function analyzeCards(
  cards: LorcanaCard[],
  filePaths: Map<string, string>,
  options: Pick<CliOptions, "canonicalParity">,
): { findings: Finding[]; summary: Summary } {
  const findings: Finding[] = [];
  let textEntriesScanned = 0;

  for (const card of cards) {
    const textEntries = toTextEntries(card.text);
    const filePath = getCardFilePath(card, filePaths);

    textEntriesScanned += textEntries.length;

    if (
      (card.abilities?.length ?? 0) === 0 &&
      !("vanilla" in card && card.vanilla) &&
      textEntries.some((entry) => isGameplayAbilityLikeText(entry.fullText))
    ) {
      findings.push(
        makeFinding(
          card,
          filePath,
          "empty-abilities-suspicious",
          "high",
          textEntries
            .filter((entry) => isGameplayAbilityLikeText(entry.fullText))
            .map((entry) => entry.fullText)
            .join(" / "),
          "one or more structured abilities matching the printed gameplay text",
          "count=0; top=none; triggers=none; effects=none; keywords=none",
          "Printed text looks like a real in-game ability, but the card definition has an empty abilities array.",
        ),
      );
    }

    for (const ability of card.abilities ?? []) {
      const abilityName = normalizeCardTextContent(ability.name ?? "").trim();
      if (!abilityName) continue;

      const matchingEntry = textEntries.find((entry) => {
        const entryTitle = entry.title.trim();
        return (
          entryTitle &&
          abilityName.startsWith(entryTitle) &&
          abilityName.length > entryTitle.length + 5
        );
      });

      if (matchingEntry) {
        const leaked = abilityName.slice(matchingEntry.title.trim().length).trim();
        if (/^\([^)]+\)$/.test(leaked)) continue;
        findings.push(
          makeFinding(
            card,
            filePath,
            "ability-name-leak",
            "low",
            matchingEntry.fullText,
            `ability name should be "${matchingEntry.title.trim()}"`,
            `ability name is "${abilityName}"`,
            `Ability name contains text beyond the title: "${leaked}". The name field should only contain the ability title, not part of the rules text.`,
          ),
        );
      }
    }

    for (const ability of card.abilities ?? []) {
      if (ability.type === "keyword" || !ability.text) continue;
      const abilityNameValue = normalizeCardTextContent(ability.name ?? "").trim();
      if (abilityNameValue) continue;

      const abilityTextValue = normalizeCardTextContent(ability.text).trim();
      const titleMatch = abilityTextValue.match(
        /^([A-Z][A-Z0-9'",.!?&/:;+\-…]*(?: [A-Z][A-Z0-9'",.!?&/:;+\-…]*)*)\s/,
      );
      if (titleMatch) {
        const inferredName = titleMatch[1];
        const matchingEntry = textEntries.find(
          (entry) => entry.title.trim().toUpperCase() === inferredName.toUpperCase(),
        );
        if (matchingEntry) {
          findings.push(
            makeFinding(
              card,
              filePath,
              "missing-ability-name",
              "low",
              matchingEntry.fullText,
              `ability should have name: "${inferredName}"`,
              `ability has no name field but text starts with "${inferredName}"`,
              "Ability is missing a name field. The ability text starts with what appears to be the ability title from the printed card text.",
            ),
          );
        }
      }
    }

    for (const [entryIndex, entry] of textEntries.entries()) {
      if (
        entry.description &&
        (card.abilities?.length ?? 0) > 0 &&
        isGameplayAbilityLikeText(entry.fullText) &&
        !isLikelyEntryAlignmentNoise(entry) &&
        !hasDirectAbilityMatch(entry, card.abilities) &&
        !hasCompositeKeywordGrantMatch(entry, card.abilities)
      ) {
        findings.push(
          makeFinding(
            card,
            filePath,
            "entry-alignment-missing",
            "medium",
            entry.fullText,
            "a structured ability whose name or text directly matches this printed entry",
            summarizeSignals(collectAbilitySignals(card.abilities)),
            "This printed entry only passes because analysis falls back to the whole abilities array; no individual ability is directly aligned to the entry title or full text.",
          ),
        );
      }

      const malformedTitleSplit = detectMalformedTitleDescriptionSplit(entry, card.abilities);
      if (malformedTitleSplit) {
        findings.push(
          makeFinding(
            card,
            filePath,
            "malformed-title-description-split",
            "medium",
            entry.fullText,
            `${malformedTitleSplit.reconstructedTitle} / ${malformedTitleSplit.reconstructedDescription}`,
            summarizeSignals(collectAbilitySignals(card.abilities)),
            "Printed text entry appears to split the ability title across `title` and `description`, which hides metadata alignment issues and makes the structured text harder to audit.",
          ),
        );
      }

      const adjacentTitleOnlySplit = detectAdjacentTitleOnlySplit(
        textEntries,
        entryIndex,
        card.abilities,
      );
      if (adjacentTitleOnlySplit) {
        findings.push(
          makeFinding(
            card,
            filePath,
            "malformed-title-description-split",
            "medium",
            entry.fullText,
            `${adjacentTitleOnlySplit.reconstructedTitle} / ${adjacentTitleOnlySplit.reconstructedDescription}`,
            summarizeSignals(collectAbilitySignals(card.abilities)),
            "Printed text appears to split one ability title across adjacent text entries, leaving a title-only stub before the actual rules text entry.",
          ),
        );
      }

      const relevantAbilities = getRelevantAbilitiesForEntry(entry, card.abilities);
      const signals = collectAbilitySignals(relevantAbilities);

      if (
        startsWithTriggerSignal(entry.signalText) &&
        !hasExpectedTriggerClauseParity(entry.signalText, relevantAbilities)
      ) {
        findings.push(
          makeFinding(
            card,
            filePath,
            "trigger-timing-mismatch",
            "medium",
            entry.fullText,
            inferExpectedTriggerClauses(entry.signalText)
              .map((clause) => `${clause.event}:${clause.timing}`)
              .join(", "),
            summarizeSignals(signals),
            "Printed trigger timing does not match the structured trigger clauses for this entry.",
          ),
        );
      }

      if (
        startsWithTriggerSignal(entry.signalText) &&
        !hasExpectedTriggerSubjectParity(entry.signalText, relevantAbilities)
      ) {
        findings.push(
          makeFinding(
            card,
            filePath,
            "trigger-subject-mismatch",
            "high",
            entry.fullText,
            `trigger subject parity matching ${inferExpectedTriggerSubjects(entry.signalText).join(", ")}`,
            summarizeSignals(signals),
            "Printed trigger subject scope does not match the structured trigger `on` value.",
          ),
        );
      }

      if (
        startsWithTriggerSignal(entry.signalText) &&
        !supportsTriggerLikeText(entry.signalText, signals, relevantAbilities)
      ) {
        const category = classifyTriggerFindingCategory(signals);
        const severity: Severity =
          category === "trigger-like-missing" || isWrongActionFamily(signals) ? "high" : "medium";
        const expectedSignal = isReplacementLikeText(entry.signalText)
          ? "replacement support or triggered support for replacement-like text"
          : "top-level triggered ability or action-created floating triggered ability";

        findings.push(
          makeFinding(
            card,
            filePath,
            category,
            severity,
            entry.fullText,
            expectedSignal,
            summarizeSignals(signals),
            "Printed text starts like a triggered ability, but the structured ability data does not expose a compatible trigger family.",
          ),
        );
      }

      if (isActivatedLikeText(entry.signalText) && !signals.hasActivatedSupport) {
        const category = classifyActivatedFindingCategory(signals);

        findings.push(
          makeFinding(
            card,
            filePath,
            category,
            category === "activated-like-missing" || isWrongActionFamily(signals)
              ? "high"
              : "medium",
            entry.fullText,
            "activated ability support or granted activated ability support",
            summarizeSignals(signals),
            "Printed text looks activated, but the ability data does not expose an activated ability shape.",
          ),
        );
      }

      if (isCostReductionText(entry.signalText) && !supportsCostReductionText(signals)) {
        const severity: Severity = signals.nestedTypes.includes("play-card") ? "high" : "medium";
        const whySuspicious = signals.nestedTypes.includes("play-card")
          ? "Printed text says the next card costs less, but the data only exposes play-card semantics instead of a discount effect."
          : "Printed text says the card costs less, but the structured ability data does not expose a cost-reduction family.";

        findings.push(
          makeFinding(
            card,
            filePath,
            "cost-reduction-family-mismatch",
            severity,
            entry.fullText,
            "cost-reduction or move-cost-reduction support",
            summarizeSignals(signals),
            whySuspicious,
          ),
        );
      }

      const keywordGrant = detectKeywordGrant(entry.signalText);
      if (keywordGrant && !supportsKeywordGrantText(signals, keywordGrant)) {
        findings.push(
          makeFinding(
            card,
            filePath,
            "keyword-grant-missing",
            signals.abilityCount === 0 ? "high" : "medium",
            entry.fullText,
            `gain-keyword, gain-keywords, or grant-ability support for ${keywordGrant}`,
            summarizeSignals(signals),
            "Printed text grants a keyword, but the structured ability data does not expose a matching keyword-granting shape.",
          ),
        );
      }
    }
  }

  if (options.canonicalParity) {
    const cardsByCanonicalId = new Map<string, LorcanaCard[]>();
    for (const card of cards) {
      const group = cardsByCanonicalId.get(card.canonicalId) ?? [];
      group.push(card);
      cardsByCanonicalId.set(card.canonicalId, group);
    }

    for (const group of cardsByCanonicalId.values()) {
      if (group.length < 2) continue;

      const cardsByText = new Map<string, LorcanaCard[]>();
      for (const card of group) {
        const fingerprint = normalizeTextFingerprint(card.text);
        const cardsWithSameText = cardsByText.get(fingerprint) ?? [];
        cardsWithSameText.push(card);
        cardsByText.set(fingerprint, cardsWithSameText);
      }

      for (const sameTextCards of cardsByText.values()) {
        if (sameTextCards.length < 2) continue;

        const sortedCards = [...sameTextCards].sort((left, right) => {
          if (left.set !== right.set) return left.set.localeCompare(right.set);
          return left.cardNumber - right.cardNumber;
        });

        const baseline = sortedCards[0]!;
        const baselineSummary = summarizeAbilityForParity(baseline);

        for (const card of sortedCards.slice(1)) {
          const summary = summarizeAbilityForParity(card);
          const mismatches = compareParitySummary(baselineSummary, summary);
          if (mismatches.length === 0) continue;

          findings.push(
            makeFinding(
              card,
              getCardFilePath(card, filePaths),
              "canonical-parity",
              getParitySeverity(baselineSummary, summary),
              toTextEntries(card.text)
                .map((entry) => entry.fullText)
                .join(" / "),
              `${getSetCardNumber(baseline)} ${getCardDisplayName(baseline)} => ${summarizeAbilityForExpected(baselineSummary)}`,
              summarizeAbilityForExpected(summary),
              `Same canonical card and identical printed text, but ${mismatches.join("; ")}.`,
            ),
          );
        }
      }
    }
  }

  findings.sort((left, right) => {
    const severityComparison = SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity];
    if (severityComparison !== 0) return severityComparison;

    const categoryComparison = left.category.localeCompare(right.category);
    if (categoryComparison !== 0) return categoryComparison;

    const setComparison = left.setCardNumber.localeCompare(right.setCardNumber);
    if (setComparison !== 0) return setComparison;

    return left.cardName.localeCompare(right.cardName);
  });

  const dedupedFindings = dedupeFindings(findings);

  const findingsBySeverity: Record<Severity, number> = {
    high: 0,
    medium: 0,
    low: 0,
  };
  const findingsByCategory: Record<FindingCategory, number> = {
    "trigger-like-missing": 0,
    "trigger-like-family-mismatch": 0,
    "trigger-timing-mismatch": 0,
    "trigger-subject-mismatch": 0,
    "activated-like-missing": 0,
    "activated-like-family-mismatch": 0,
    "cost-reduction-family-mismatch": 0,
    "keyword-grant-missing": 0,
    "empty-abilities-suspicious": 0,
    "entry-alignment-missing": 0,
    "malformed-title-description-split": 0,
    "ability-name-leak": 0,
    "missing-ability-name": 0,
    "canonical-parity": 0,
  };

  for (const finding of dedupedFindings) {
    findingsBySeverity[finding.severity] += 1;
    findingsByCategory[finding.category] += 1;
  }

  return {
    findings: dedupedFindings,
    summary: {
      cardsScanned: cards.length,
      textEntriesScanned,
      findingsBySeverity,
      findingsByCategory,
    },
  };
}
