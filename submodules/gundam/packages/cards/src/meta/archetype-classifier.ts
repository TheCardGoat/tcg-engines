import type { Card } from "@tcg/gundam-types";
import * as cardDefinitions from "../cards/index.ts";
import { sourceTitleByCardNumber } from "../cards/source-titles.ts";

export const GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION =
  "gundam.tournament-archetype.source-title-colors.v1";

export interface GundamArchetypeDeckEntry {
  readonly canonicalId: string;
  readonly quantity: number;
}

export interface GundamArchetypeDeckSection {
  readonly id: string;
  readonly entries: ReadonlyArray<GundamArchetypeDeckEntry>;
}

export interface GundamArchetypeDeckDocument {
  readonly game: string;
  readonly sections: ReadonlyArray<GundamArchetypeDeckSection>;
}

export interface GundamArchetypeClassifierThresholds {
  readonly minimumMainDeckCopies: number;
  readonly minimumResolvedShare: number;
  readonly minimumDominantThemeShare: number;
  readonly minimumLeadOverRunnerUp: number;
  readonly minimumDominantDistinctCards: number;
}

export interface GundamArchetypeClassifierConfig {
  readonly thresholds?: Partial<GundamArchetypeClassifierThresholds>;
  readonly catalog?: ReadonlyMap<string, Card>;
}

export interface GundamTournamentMetaProjectedCard {
  readonly canonicalCardId: string;
  readonly cardType: string;
  readonly quantity: number;
}

export interface GundamTournamentMetaDeckProjectionV1 {
  readonly archetype: {
    readonly key: string;
    readonly label: string;
  };
  readonly cards: ReadonlyArray<GundamTournamentMetaProjectedCard>;
  readonly classification: GundamArchetypeClassification;
}

export interface GundamArchetypeThemeEvidence {
  readonly title: string;
  readonly copies: number;
  readonly share: number;
  readonly distinctCards: number;
}

export interface GundamArchetypeMatchedCardEvidence {
  readonly canonicalId: string;
  readonly name: string;
  readonly quantity: number;
  readonly sourceTitle: string;
  readonly color: string;
}

export type GundamArchetypeDiagnosticCode =
  | "wrong-game"
  | "main-deck-missing"
  | "main-deck-too-small"
  | "catalog-coverage-insufficient"
  | "dominant-theme-below-floor"
  | "dominant-theme-too-narrow"
  | "dominant-theme-ambiguous"
  | "color-identity-unresolved"
  | "color-identity-invalid";

export interface GundamArchetypeClassificationEvidence {
  readonly mainDeckCopies: number;
  readonly resolvedCopies: number;
  readonly resolvedShare: number;
  readonly colors: ReadonlyArray<string>;
  readonly themes: ReadonlyArray<GundamArchetypeThemeEvidence>;
  readonly dominant: GundamArchetypeThemeEvidence | null;
  readonly runnerUp: GundamArchetypeThemeEvidence | null;
  readonly matchedCards: ReadonlyArray<GundamArchetypeMatchedCardEvidence>;
  readonly thresholds: GundamArchetypeClassifierThresholds;
  readonly unresolvedEntries: ReadonlyArray<{
    readonly canonicalId: string;
    readonly quantity: number;
  }>;
}

export type GundamArchetypeClassification =
  | {
      readonly status: "classified";
      readonly id: string;
      readonly label: string;
      readonly version: typeof GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION;
      readonly evidence: GundamArchetypeClassificationEvidence;
      readonly diagnostics: readonly [];
    }
  | {
      readonly status: "unclassified";
      readonly id: "unclassified";
      readonly label: "Unclassified";
      readonly version: typeof GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION;
      readonly evidence: GundamArchetypeClassificationEvidence;
      readonly diagnostics: ReadonlyArray<{
        readonly code: GundamArchetypeDiagnosticCode;
        readonly message: string;
      }>;
    };

export const GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_THRESHOLDS_V1 =
  Object.freeze<GundamArchetypeClassifierThresholds>({
    minimumMainDeckCopies: 40,
    minimumResolvedShare: 0.9,
    minimumDominantThemeShare: 0.35,
    minimumLeadOverRunnerUp: 0.1,
    minimumDominantDistinctCards: 3,
  });

const SOURCE_TITLES = sourceTitleByCardNumber as Readonly<Record<string, string>>;

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    "canonicalId" in value &&
    "type" in value
  );
}

function buildCatalog(): ReadonlyMap<string, Card> {
  const catalog = new Map<string, Card>();
  for (const value of Object.values(cardDefinitions)) {
    if (!isCard(value)) continue;
    catalog.set(value.cardNumber, value);
    if (!catalog.has(value.canonicalId)) catalog.set(value.canonicalId, value);
  }
  return catalog;
}

const DEFAULT_CATALOG = buildCatalog();

function validateThreshold(
  value: number,
  name: keyof GundamArchetypeClassifierThresholds,
  range: "count" | "share",
): number {
  if (
    !Number.isFinite(value) ||
    (range === "count" && (!Number.isInteger(value) || value < 1)) ||
    (range === "share" && (value < 0 || value > 1))
  ) {
    throw new Error(`Invalid Gundam archetype classifier threshold "${name}"`);
  }
  return value;
}

function thresholds(
  overrides: Partial<GundamArchetypeClassifierThresholds> | undefined,
): GundamArchetypeClassifierThresholds {
  const merged = {
    ...GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_THRESHOLDS_V1,
    ...overrides,
  };
  return {
    minimumMainDeckCopies: validateThreshold(
      merged.minimumMainDeckCopies,
      "minimumMainDeckCopies",
      "count",
    ),
    minimumResolvedShare: validateThreshold(
      merged.minimumResolvedShare,
      "minimumResolvedShare",
      "share",
    ),
    minimumDominantThemeShare: validateThreshold(
      merged.minimumDominantThemeShare,
      "minimumDominantThemeShare",
      "share",
    ),
    minimumLeadOverRunnerUp: validateThreshold(
      merged.minimumLeadOverRunnerUp,
      "minimumLeadOverRunnerUp",
      "share",
    ),
    minimumDominantDistinctCards: validateThreshold(
      merged.minimumDominantDistinctCards,
      "minimumDominantDistinctCards",
      "count",
    ),
  };
}

function sourceTitleFor(card: Card): string | undefined {
  const baseCardNumber = card.cardNumber.replace(/-p\d+$/i, "");
  const value =
    card.sourceTitle ??
    SOURCE_TITLES[card.cardNumber] ??
    SOURCE_TITLES[baseCardNumber] ??
    SOURCE_TITLES[card.canonicalId];
  const normalized = value?.trim();
  return normalized && normalized !== "-" ? normalized : undefined;
}

function roundShare(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function colorLabel(colors: ReadonlyArray<string>): string {
  return colors.map((color) => `${color[0]!.toUpperCase()}${color.slice(1)}`).join("/");
}

function unclassified(
  evidence: GundamArchetypeClassificationEvidence,
  code: GundamArchetypeDiagnosticCode,
  message: string,
): GundamArchetypeClassification {
  return {
    status: "unclassified",
    id: "unclassified",
    label: "Unclassified",
    version: GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION,
    evidence,
    diagnostics: [{ code, message }],
  };
}

export function classifyGundamTournamentArchetype(
  document: GundamArchetypeDeckDocument,
  config: GundamArchetypeClassifierConfig = {},
): GundamArchetypeClassification {
  const appliedThresholds = thresholds(config.thresholds);
  const emptyEvidence: GundamArchetypeClassificationEvidence = {
    mainDeckCopies: 0,
    resolvedCopies: 0,
    resolvedShare: 0,
    colors: [],
    themes: [],
    dominant: null,
    runnerUp: null,
    matchedCards: [],
    thresholds: appliedThresholds,
    unresolvedEntries: [],
  };
  if (document.game !== "gundam") {
    return unclassified(emptyEvidence, "wrong-game", "Expected a Gundam deck document.");
  }
  const main = document.sections.find(({ id }) => id === "main");
  if (!main) {
    return unclassified(emptyEvidence, "main-deck-missing", "Main Deck evidence is missing.");
  }

  const catalog = config.catalog ?? DEFAULT_CATALOG;
  const aggregate = new Map<string, number>();
  for (const entry of main.entries) {
    if (
      typeof entry.canonicalId !== "string" ||
      entry.canonicalId.length === 0 ||
      !Number.isInteger(entry.quantity) ||
      entry.quantity <= 0
    ) {
      continue;
    }
    aggregate.set(entry.canonicalId, (aggregate.get(entry.canonicalId) ?? 0) + entry.quantity);
  }

  const mainDeckCopies = [...aggregate.values()].reduce((sum, quantity) => sum + quantity, 0);
  const themeCounts = new Map<string, { copies: number; cards: Set<string> }>();
  const colors = new Set<string>();
  const unresolvedEntries: Array<{ canonicalId: string; quantity: number }> = [];
  const matchedCards: GundamArchetypeMatchedCardEvidence[] = [];
  let resolvedCopies = 0;

  for (const [canonicalId, quantity] of aggregate) {
    const card = catalog.get(canonicalId);
    if (!card || card.type === "resource" || !card.color) {
      unresolvedEntries.push({ canonicalId, quantity });
      continue;
    }
    const sourceTitle = sourceTitleFor(card);
    if (!sourceTitle) {
      unresolvedEntries.push({ canonicalId, quantity });
      continue;
    }
    resolvedCopies += quantity;
    colors.add(card.color);
    const theme = themeCounts.get(sourceTitle) ?? { copies: 0, cards: new Set<string>() };
    theme.copies += quantity;
    theme.cards.add(card.canonicalId);
    themeCounts.set(sourceTitle, theme);
    matchedCards.push({
      canonicalId: card.canonicalId,
      name: card.name,
      quantity,
      sourceTitle,
      color: card.color,
    });
  }

  const themes = [...themeCounts]
    .map(([title, value]) => ({
      title,
      copies: value.copies,
      share: mainDeckCopies === 0 ? 0 : roundShare(value.copies / mainDeckCopies),
      distinctCards: value.cards.size,
    }))
    .sort(
      (left, right) =>
        right.copies - left.copies ||
        right.distinctCards - left.distinctCards ||
        left.title.localeCompare(right.title),
    );
  const sortedColors = [...colors].sort();
  const dominant = themes[0] ?? null;
  const runnerUp = themes[1] ?? null;
  const evidence: GundamArchetypeClassificationEvidence = {
    mainDeckCopies,
    resolvedCopies,
    resolvedShare: mainDeckCopies === 0 ? 0 : roundShare(resolvedCopies / mainDeckCopies),
    colors: sortedColors,
    themes,
    dominant,
    runnerUp,
    matchedCards: matchedCards.sort((left, right) =>
      left.canonicalId.localeCompare(right.canonicalId),
    ),
    thresholds: appliedThresholds,
    unresolvedEntries: unresolvedEntries.sort((left, right) =>
      left.canonicalId.localeCompare(right.canonicalId),
    ),
  };

  if (mainDeckCopies < appliedThresholds.minimumMainDeckCopies) {
    return unclassified(
      evidence,
      "main-deck-too-small",
      `Main Deck evidence has ${mainDeckCopies} cards; ${appliedThresholds.minimumMainDeckCopies} are required.`,
    );
  }
  if (evidence.resolvedShare < appliedThresholds.minimumResolvedShare) {
    return unclassified(
      evidence,
      "catalog-coverage-insufficient",
      `Only ${Math.round(evidence.resolvedShare * 100)}% of Main Deck cards have source-title evidence.`,
    );
  }
  if (!dominant || dominant.share < appliedThresholds.minimumDominantThemeShare) {
    return unclassified(
      evidence,
      "dominant-theme-below-floor",
      "No source title reaches the configured dominant-theme share floor.",
    );
  }
  if (dominant.distinctCards < appliedThresholds.minimumDominantDistinctCards) {
    return unclassified(
      evidence,
      "dominant-theme-too-narrow",
      "The dominant source-title evidence spans too few distinct cards.",
    );
  }
  if (
    runnerUp &&
    roundShare(dominant.share - runnerUp.share) < appliedThresholds.minimumLeadOverRunnerUp
  ) {
    return unclassified(
      evidence,
      "dominant-theme-ambiguous",
      "The leading source titles are too close to classify deterministically.",
    );
  }
  if (sortedColors.length === 0) {
    return unclassified(
      evidence,
      "color-identity-unresolved",
      "Exact deck color identity could not be resolved from classified cards.",
    );
  }
  if (sortedColors.length > 2) {
    return unclassified(
      evidence,
      "color-identity-invalid",
      `Resolved Main Deck evidence contains ${sortedColors.length} colors.`,
    );
  }

  const colorsId = sortedColors.join("-");
  return {
    status: "classified",
    id: `${slugify(dominant.title)}--${colorsId}`,
    label: `${dominant.title} — ${colorLabel(sortedColors)}`,
    version: GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION,
    evidence,
    diagnostics: [],
  };
}

export function projectGundamTournamentMetaDeckV1(
  document: GundamArchetypeDeckDocument,
  config: GundamArchetypeClassifierConfig = {},
): GundamTournamentMetaDeckProjectionV1 {
  const catalog = config.catalog ?? DEFAULT_CATALOG;
  const classification = classifyGundamTournamentArchetype(document, {
    ...config,
    catalog,
  });
  const main = document.sections.find(({ id }) => id === "main");
  const cards = new Map<string, GundamTournamentMetaProjectedCard>();
  for (const entry of main?.entries ?? []) {
    const card = catalog.get(entry.canonicalId);
    if (!card || card.type === "resource") continue;
    const current = cards.get(card.canonicalId);
    cards.set(card.canonicalId, {
      canonicalCardId: card.canonicalId,
      cardType: card.type,
      quantity: (current?.quantity ?? 0) + entry.quantity,
    });
  }
  return {
    archetype: {
      key: classification.id,
      label: classification.label,
    },
    cards: [...cards.values()].sort((left, right) =>
      left.canonicalCardId.localeCompare(right.canonicalCardId),
    ),
    classification,
  };
}

/**
 * Cross-game publication boundary. Diagnostic consumers can use
 * {@link projectGundamTournamentMetaDeckV1}; generic projection workers receive
 * `null` so failed classification contributes to unclassified coverage instead
 * of becoming a fabricated archetype row.
 */
export function projectClassifiedGundamTournamentMetaDeckV1(
  document: GundamArchetypeDeckDocument,
  config: GundamArchetypeClassifierConfig = {},
): Omit<GundamTournamentMetaDeckProjectionV1, "classification"> | null {
  const projection = projectGundamTournamentMetaDeckV1(document, config);
  if (projection.classification.status !== "classified") return null;
  return {
    archetype: projection.archetype,
    cards: projection.cards,
  };
}
