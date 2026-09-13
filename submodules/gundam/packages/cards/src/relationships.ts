import type { Card, CardPrinting, PilotCard, UnitCard } from "@tcg/gundam-types";

export type GundamCardRelationshipKind = "link-partner";
export type GundamCardRelationshipDirection = "unit-to-pilot" | "pilot-to-unit";

export interface GundamCardRelationshipTarget {
  readonly canonicalId: string;
  readonly printingId: string;
  readonly cardNumber: string;
  readonly slug: string;
  readonly name: string;
  readonly cardType: "unit" | "pilot";
  readonly setCode: string;
  readonly collectorNumber: string;
  readonly imageUrl: string;
}

export interface GundamCardRelationship {
  readonly kind: GundamCardRelationshipKind;
  readonly direction: GundamCardRelationshipDirection;
  readonly sourceCanonicalId: string;
  /** The Unit's exact printed Link Condition, retained in both directions. */
  readonly sourceCondition: string;
  readonly target: GundamCardRelationshipTarget;
}

export type GundamCardRelationshipDiagnostic =
  | {
      readonly code: "no-named-link-requirement";
      readonly sourceCanonicalId: string;
      readonly sourceCondition: string;
    }
  | {
      readonly code: "unresolved-link-name";
      readonly sourceCanonicalId: string;
      readonly sourceCondition: string;
      readonly requirement: string;
    }
  | {
      readonly code: "target-printing-unavailable";
      readonly sourceCanonicalId: string;
      readonly sourceCondition: string;
      readonly targetCanonicalId: string;
    };

export interface GundamCardRelationshipResolution {
  readonly relationships: readonly GundamCardRelationship[];
  readonly diagnostics: readonly GundamCardRelationshipDiagnostic[];
}

interface NamedLinkRequirement {
  readonly raw: string;
  readonly normalized: string;
}

function normalizeCatalogName(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("en-US");
}

export function parseGundamNamedLinkRequirements(
  sourceCondition: string,
): readonly NamedLinkRequirement[] {
  const requirements = new Map<string, NamedLinkRequirement>();
  for (const match of sourceCondition.matchAll(/\[([^\]]+)\]/gu)) {
    const raw = match[1]?.trim() ?? "";
    const normalized = normalizeCatalogName(raw);
    if (normalized.length > 0 && !requirements.has(normalized)) {
      requirements.set(normalized, { raw, normalized });
    }
  }
  return [...requirements.values()];
}

function isPilot(card: Card): card is PilotCard {
  return card.type === "pilot";
}

function isUnit(card: Card): card is UnitCard {
  return card.type === "unit";
}

function preferredCanonicalDefinition(cards: readonly Card[]): Card {
  return (
    cards.find((card) => card.cardNumber === card.canonicalId) ??
    [...cards].sort((left, right) =>
      left.cardNumber.localeCompare(right.cardNumber, "en", {
        numeric: true,
        sensitivity: "base",
      }),
    )[0]!
  );
}

function canonicalCatalog(cards: readonly Card[]): readonly Card[] {
  const groups = new Map<string, Card[]>();
  for (const card of cards) {
    const group = groups.get(card.canonicalId) ?? [];
    group.push(card);
    groups.set(card.canonicalId, group);
  }
  return [...groups.values()].map(preferredCanonicalDefinition);
}

function catalogNameKeys(card: Card): readonly string[] {
  const keys = new Set([normalizeCatalogName(card.name)]);
  for (const alternateName of card.alternateNames ?? []) {
    const normalized = normalizeCatalogName(alternateName);
    if (normalized.length > 0) keys.add(normalized);
  }
  return [...keys];
}

function pilotCandidates(
  cards: readonly Card[],
  requirement: NamedLinkRequirement,
): readonly PilotCard[] {
  return cards.filter(
    (card): card is PilotCard =>
      isPilot(card) && catalogNameKeys(card).some((name) => name.includes(requirement.normalized)),
  );
}

function preferredPrinting(card: Card): CardPrinting | null {
  const selected = card.selectedPrintingId
    ? card.printings.find((printing) => printing.id === card.selectedPrintingId)
    : undefined;
  return selected ?? card.printings[0] ?? null;
}

function targetProjection(card: UnitCard | PilotCard): GundamCardRelationshipTarget | null {
  const printing = preferredPrinting(card);
  if (!printing) return null;
  return {
    canonicalId: card.canonicalId,
    printingId: printing.id,
    cardNumber: card.cardNumber,
    slug: card.slug,
    name: card.displayName ?? card.name,
    cardType: card.type,
    setCode: printing.setCode,
    collectorNumber: printing.collectorNumber,
    imageUrl: printing.imageUrl,
  };
}

function compareRelationships(left: GundamCardRelationship, right: GundamCardRelationship): number {
  return (
    left.target.name.localeCompare(right.target.name, "en", { sensitivity: "base" }) ||
    left.target.cardNumber.localeCompare(right.target.cardNumber, "en", {
      numeric: true,
      sensitivity: "base",
    })
  );
}

/**
 * Resolves only source-backed named Link partners. Bracketed requirements are
 * compared with normalized Pilot catalog names using the containment rule in
 * comprehensive rule 3-2-6-4. Every matching canonical Pilot is a legal
 * partner; trait/category clauses remain printed text and never expand into
 * generic recommendations.
 */
export function resolveGundamCardRelationships(
  sourceCard: Card,
  catalogCards: readonly Card[],
): GundamCardRelationshipResolution {
  const cards = canonicalCatalog(catalogCards);
  const relationships: GundamCardRelationship[] = [];
  const diagnostics: GundamCardRelationshipDiagnostic[] = [];

  const resolveRequirement = (
    unit: UnitCard,
    requirement: NamedLinkRequirement,
  ): readonly PilotCard[] => {
    const candidates = pilotCandidates(cards, requirement);
    if (candidates.length === 0) {
      diagnostics.push({
        code: "unresolved-link-name",
        sourceCanonicalId: unit.canonicalId,
        sourceCondition: unit.linkCondition!,
        requirement: requirement.raw,
      });
      return [];
    }
    return candidates;
  };

  if (isUnit(sourceCard) && sourceCard.linkCondition) {
    const requirements = parseGundamNamedLinkRequirements(sourceCard.linkCondition);
    if (requirements.length === 0) {
      diagnostics.push({
        code: "no-named-link-requirement",
        sourceCanonicalId: sourceCard.canonicalId,
        sourceCondition: sourceCard.linkCondition,
      });
    }
    for (const requirement of requirements) {
      for (const pilot of resolveRequirement(sourceCard, requirement)) {
        const target = targetProjection(pilot);
        if (!target) {
          diagnostics.push({
            code: "target-printing-unavailable",
            sourceCanonicalId: sourceCard.canonicalId,
            sourceCondition: sourceCard.linkCondition,
            targetCanonicalId: pilot.canonicalId,
          });
          continue;
        }
        relationships.push({
          kind: "link-partner",
          direction: "unit-to-pilot",
          sourceCanonicalId: sourceCard.canonicalId,
          sourceCondition: sourceCard.linkCondition,
          target,
        });
      }
    }
  } else if (isPilot(sourceCard)) {
    const sourceNameKeys = catalogNameKeys(sourceCard);
    for (const card of cards) {
      if (!isUnit(card) || !card.linkCondition) continue;
      for (const requirement of parseGundamNamedLinkRequirements(card.linkCondition)) {
        if (!sourceNameKeys.some((name) => name.includes(requirement.normalized))) continue;
        const pilots = resolveRequirement(card, requirement);
        if (!pilots.some((pilot) => pilot.canonicalId === sourceCard.canonicalId)) continue;
        const target = targetProjection(card);
        if (!target) {
          diagnostics.push({
            code: "target-printing-unavailable",
            sourceCanonicalId: sourceCard.canonicalId,
            sourceCondition: card.linkCondition,
            targetCanonicalId: card.canonicalId,
          });
          continue;
        }
        relationships.push({
          kind: "link-partner",
          direction: "pilot-to-unit",
          sourceCanonicalId: sourceCard.canonicalId,
          sourceCondition: card.linkCondition,
          target,
        });
      }
    }
  }

  const uniqueRelationships = new Map<string, GundamCardRelationship>();
  for (const relationship of relationships) {
    uniqueRelationships.set(
      `${relationship.direction}\u0000${relationship.target.canonicalId}`,
      relationship,
    );
  }
  return {
    relationships: [...uniqueRelationships.values()].sort(compareRelationships),
    diagnostics,
  };
}
