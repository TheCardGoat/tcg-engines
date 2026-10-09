import { hostedUndoProposalPolicy } from "@tcg/shared/game-adapter";
import {
  cards as generatedCyberpunkCards,
  getCyberpunkCanonicalForCardId,
  getMergedCyberpunkCards,
  structuredCards as cyberpunkStructuredCards,
} from "@tcg/cyberpunk-cards";
import {
  toCyberpunkValidationCard,
  validateCyberpunkDeck,
  type CyberpunkDeckValidationEntry,
  type CyberpunkValidationCatalogCard,
} from "@tcg/shared/cyberpunk/deck-validation";
import {
  cyberpunkFormatFamily,
  validateCyberpunkSixPackDeck,
} from "@tcg/shared/cyberpunk/six-pack-deck-validation";
import type {
  CardSummary,
  DeckCard,
  DeckFormatResult,
  DeckValidationContext,
  GameAdapter,
} from "@tcg/shared/game-adapter";
import {
  buildColorMetadataFacets,
  materializeDeckInstances,
  normalizeMetadataColors,
  sortMetadataFacets,
} from "@tcg/shared/game-adapter";
import { slugify } from "@tcg/shared/utils";
import {
  cyberpunkCreateServerEngine,
  cyberpunkExtractCardsMapsFromSnapshot,
  cyberpunkRestoreEngine,
  cyberpunkSerializeEngine,
} from "./cyberpunk-engine-lifecycle";
import { cyberpunkDeckInterchangeAdapter } from "./deck-interchange";
import {
  createCyberpunkPreboardPool,
  CYBERPUNK_PREBOARD_DEADLINE_MS,
  cyberpunkPreboardApplies,
  cyberpunkPreboardToJson,
  defaultCyberpunkPreboardSelection,
  materializeCyberpunkPreboard,
  nextCyberpunkPreboardPool,
  parseCyberpunkPreboardPool,
  parseCyberpunkPreboardSelection,
  projectCyberpunkPreboardPool,
  projectCyberpunkPreboardSelection,
  projectCyberpunkRivalLegends,
  reconcileCyberpunkPreboard,
  validateCyberpunkPreboard,
} from "./preboard";
import { CYBERPUNK_RUNTIME_FINGERPRINT } from "./runtime-fingerprint";
import { projectRamDistribution } from "./ram-distribution";

const cyberpunkCardsByPublicId = new Map(cyberpunkStructuredCards.map((card) => [card.id, card]));
for (const card of getMergedCyberpunkCards()) {
  cyberpunkCardsByPublicId.set(card.canonicalId, card);
}

// Catalog slugs are source-owned and remain stable URLs. Some older deck rows
// instead contain a slug derived from the displayed name. Resolve such a row
// only when accent-folding identifies a single card, never as an authoritative
// identity or when it would be ambiguous.
const cyberpunkCardsByDerivedSlug = new Map<
  string,
  ReturnType<typeof getMergedCyberpunkCards>[number]
>();
const ambiguousDerivedSlugs = new Set<string>();
for (const card of getMergedCyberpunkCards()) {
  const derivedSlug = slugify(card.displayName);
  const existing = cyberpunkCardsByDerivedSlug.get(derivedSlug);
  if (existing && existing.canonicalId !== card.canonicalId) {
    cyberpunkCardsByDerivedSlug.delete(derivedSlug);
    ambiguousDerivedSlugs.add(derivedSlug);
  } else if (!ambiguousDerivedSlugs.has(derivedSlug)) {
    cyberpunkCardsByDerivedSlug.set(derivedSlug, card);
  }
}

// Metadata projection and normalization use the public-id map directly, so
// register each safe legacy alias there as well. Never overwrite a catalog id:
// source-owned ids remain authoritative over display-derived compatibility ids.
for (const [derivedSlug, card] of cyberpunkCardsByDerivedSlug) {
  if (!cyberpunkCardsByPublicId.has(derivedSlug)) {
    cyberpunkCardsByPublicId.set(derivedSlug, card);
  }
}

function resolveCyberpunkCard(publicId: string) {
  return cyberpunkCardsByPublicId.get(publicId) ?? cyberpunkCardsByDerivedSlug.get(publicId);
}

// Alpha Kit rows live in the generated catalog but are excluded from the
// merged runtime pool. Register them here so constructed legality can identify
// the printing instead of treating it as an unknown card. Never overwrite a
// runtime id: retail and promo definitions stay authoritative.
const alphaKitCardsById = new Map<string, (typeof generatedCyberpunkCards)[number]>();
for (const card of generatedCyberpunkCards) {
  if (card.set.code !== "alpha") continue;
  if (!alphaKitCardsById.has(card.id)) alphaKitCardsById.set(card.id, card);
  for (const printing of card.printings) {
    if (!alphaKitCardsById.has(printing.id)) alphaKitCardsById.set(printing.id, card);
  }
}

function resolveCyberpunkValidationCard(publicId: string, printingId?: string) {
  const card = resolveCyberpunkCard(publicId) ?? alphaKitCardsById.get(publicId);
  return card ? catalogCardForValidation(card, printingId) : undefined;
}

function catalogCardForValidation(
  card: CyberpunkValidationCatalogCard & { canonicalId: string },
  printingId: string | undefined,
): CyberpunkValidationCatalogCard & { canonicalId: string } {
  if (!printingId || card.printings?.some((printing) => printing.id === printingId)) return card;
  const alphaCard = alphaKitCardsById.get(printingId);
  const alphaPrinting = alphaCard?.printings.find((printing) => printing.id === printingId);
  if (!alphaPrinting || alphaPrinting.setCode !== "alpha") return card;
  return {
    ...card,
    printings: [
      ...(card.printings ?? []),
      {
        id: alphaPrinting.id,
        setCode: alphaPrinting.setCode,
        rarity: alphaPrinting.rarity ?? null,
      },
    ],
  };
}

/**
 * Server-side {@link GameAdapter} for Cyberpunk. Implements the same
 * contract as the Lorcana adapter so the play module never needs to know
 * which engine it's hosting.
 *
 * Constructed accepts a quick list with no sideboard, or a sideboard of up to
 * 7 cards: 40–50 main cards, exactly 3 uniquely named Legends, copy and RAM
 * limits, and Appendix B. More than 7 sideboard cards is illegal.
 * Queue policy requires preparation for competitive BO1 and every BO3.
 * Those registrations must contain exactly 7 non-Legend sideboard cards.
 */
export const cyberpunkServerAdapter: GameAdapter = {
  slug: "cyberpunk",
  botTurnScheduling: { kind: "continuation", minimumVisibleMs: 800 },
  // Current series convention: the previous game's loser chooses. The
  // comprehensive rules only specify random choice for an individual game.
  seriesFirstPlayerPolicy: "loser-chooses",
  deckInterchange: cyberpunkDeckInterchangeAdapter,
  pregame: {
    kind: "cyberpunk",
    deadlineMs: CYBERPUNK_PREBOARD_DEADLINE_MS,
    deadlineMsForFormat: (format) =>
      format === "best_of_3" ? 2 * 60 * 1000 : CYBERPUNK_PREBOARD_DEADLINE_MS,
    defaultFormatId: "constructed",
    // Game 1 draws a random chooser. The previous game's loser chooses in later games.
    turnOrderPolicy: "random-then-loser-choice",
    chooseAfterSelection: true,
    firstPlayerChoiceMs: 30_000,
    selectionMode: (pool) =>
      parseCyberpunkPreboardPool(pool).stage === "game-one" ? "fixed" : "editable",
    appliesTo: (input) => input.queueFormatId !== "six-pack" && cyberpunkPreboardApplies(input),
    createPool: (input, context) =>
      cyberpunkPreboardToJson(
        createCyberpunkPreboardPool(input, resolveCyberpunkValidationCard, context?.matchFormat),
      ),
    nextGamePool: (pool, selection) =>
      cyberpunkPreboardToJson(
        nextCyberpunkPreboardPool(
          parseCyberpunkPreboardPool(pool),
          parseCyberpunkPreboardSelection(selection),
        ),
      ),
    parsePool: (value) => cyberpunkPreboardToJson(parseCyberpunkPreboardPool(value)),
    parseSelection: (value) => cyberpunkPreboardToJson(parseCyberpunkPreboardSelection(value)),
    projectPoolForPlayer: (pool, viewer) =>
      projectCyberpunkPreboardPool(parseCyberpunkPreboardPool(pool), viewer),
    projectPublicSeat: (pool) =>
      cyberpunkPreboardToJson(projectCyberpunkRivalLegends(parseCyberpunkPreboardPool(pool))),
    projectSelectionForPlayer: (selection, viewer) =>
      projectCyberpunkPreboardSelection(parseCyberpunkPreboardSelection(selection), viewer),
    createDefaultSelection: (pool) =>
      cyberpunkPreboardToJson(defaultCyberpunkPreboardSelection(parseCyberpunkPreboardPool(pool))),
    validateSelection: (pool, selection, viewer) =>
      validateCyberpunkPreboard(
        parseCyberpunkPreboardPool(pool),
        parseCyberpunkPreboardSelection(selection),
        viewer,
      ),
    reconcileSelection: (pool, selection) => {
      const result = reconcileCyberpunkPreboard(
        parseCyberpunkPreboardPool(pool),
        parseCyberpunkPreboardSelection(selection),
      );
      return { ...result, selection: cyberpunkPreboardToJson(result.selection) };
    },
    materializeDeck: (pool, selection) =>
      materializeCyberpunkPreboard(
        parseCyberpunkPreboardPool(pool),
        parseCyberpunkPreboardSelection(selection),
      ),
  },
  proposalPolicy: hostedUndoProposalPolicy,

  createGameId(): string {
    return `cyberpunk-game-${crypto.randomUUID()}`;
  },

  generateUserName(gameProfileId: string): string {
    // Deterministic short suffix so practice/offline names are stable.
    return `cyber-${gameProfileId.slice(0, 6)}`;
  },

  buildCardInstances(decks) {
    return materializeDeckInstances(
      decks.map(({ owner, deck }) => ({
        owner,
        deck: deck.filter((entry) => entry.sectionId !== "side" && entry.sectionId !== "sideboard"),
      })),
    );
  },

  getCardById(publicId: string): CardSummary | null {
    const card = resolveCyberpunkCard(publicId);
    if (!card) return null;
    return {
      publicId,
      // Cyberpunk's "color" is a single string; expose as a one-element array
      // to match the cross-game CardSummary contract.
      colors: card.color ? [card.color] : [],
      label: card.displayName,
      imageUrl: card.imageUrl,
    };
  },

  /**
   * Resolve any Cyberpunk runtime public id (per-set/spoiler id, printing id
   * that merged onto a retail canonical) to the merged canonical id. The
   * atelier helper already applies the slug-merge canonicalization; returns
   * null for truly-unknown ids so callers fall back to the raw publicId.
   */
  getCanonicalCardId(publicId: string): string | null {
    return getCyberpunkCanonicalForCardId(publicId);
  },

  getRuntimeFingerprint() {
    return CYBERPUNK_RUNTIME_FINGERPRINT;
  },

  validateDeckForFormat(
    formatId: string,
    deck: ReadonlyArray<DeckCard>,
    context?: DeckValidationContext,
  ): DeckFormatResult {
    const formatLabel =
      formatId === "constructed" ? "Constructed" : formatId === "six-pack" ? "6-Pack" : null;
    if (!formatLabel) {
      throw new Error(`Unknown Cyberpunk format: ${formatId}`);
    }
    if (
      context?.documentFormatId &&
      cyberpunkFormatFamily(context.documentFormatId) !== cyberpunkFormatFamily(formatId)
    ) {
      return {
        formatId,
        label: formatLabel,
        valid: false,
        rules: [
          {
            kind: "format",
            passed: false,
            message: "This deck is registered for a different Cyberpunk format.",
          },
        ],
      };
    }

    // Deck identity v2+ projects Cyberpunk cards to their stable canonical
    // slug. The raw runtime catalog remains keyed by per-printing UUIDs, so
    // validate against both shapes. The merged view supplies the authoritative
    // card data for canonical ids, while the raw view keeps legacy UUID decks
    // playable during the migration.
    const unknownEntries = deck.filter((entry) => !resolveCyberpunkValidationCard(entry.cardId));
    const totalCount = deck.reduce((sum, entry) => sum + entry.quantity, 0);
    const legends: CyberpunkDeckValidationEntry[] = [];
    const mainDeck: CyberpunkDeckValidationEntry[] = [];
    const sideboard: CyberpunkDeckValidationEntry[] = [];

    for (const entry of deck) {
      const card = resolveCyberpunkValidationCard(entry.cardId);
      if (!card) continue;
      const validationEntry: CyberpunkDeckValidationEntry = {
        card: {
          ...toCyberpunkValidationCard(
            catalogCardForValidation(card, entry.printingId),
            entry.printingId,
          ),
          id: entry.cardId,
        },
        quantity: entry.quantity,
      };
      const section = entry.sectionId;
      const legend = card.type.trim().toLowerCase() === "legend";
      if (section === "side" || section === "sideboard") {
        sideboard.push(validationEntry);
      } else if (legend && section !== "main") {
        legends.push(validationEntry);
      } else {
        mainDeck.push(validationEntry);
      }
    }

    if (formatId === "six-pack") {
      const colors = Array.isArray(context?.declarations?.colors)
        ? context.declarations.colors.filter((color): color is string => typeof color === "string")
        : [];
      const asOpenedCard = (entries: CyberpunkDeckValidationEntry[]) =>
        entries.map((entry) => {
          const resolved = resolveCyberpunkValidationCard(entry.card.id);
          return {
            ...entry,
            card: { ...entry.card, id: resolved?.canonicalId ?? entry.card.id },
          };
        });
      const sixPack = validateCyberpunkSixPackDeck({
        legends: asOpenedCard(legends),
        mainDeck: asOpenedCard(mainDeck),
        sideboard: asOpenedCard(sideboard),
        colors,
        ...(context?.cardPool ? { pool: context.cardPool } : {}),
      });
      const rules = [
        {
          kind: "card-pool",
          passed: unknownEntries.length === 0,
          message:
            unknownEntries.length === 0
              ? "All cards are part of the Cyberpunk card pool"
              : `Unknown cards: ${unknownEntries.map((entry) => entry.cardId).join(", ")}`,
        },
        ...sixPack.issues.map((issue) => ({
          kind: issue.code,
          passed: false,
          message: issue.message,
        })),
      ];
      return {
        formatId,
        label: formatLabel,
        valid: unknownEntries.length === 0 && sixPack.isValid,
        rules,
      };
    }

    const deckValidation = validateCyberpunkDeck({ legends, mainDeck, sideboard });
    const rules = [
      {
        kind: "card-pool",
        passed: unknownEntries.length === 0,
        message:
          unknownEntries.length === 0
            ? `All cards are part of the Cyberpunk ${formatLabel} pool`
            : `Unknown cards: ${unknownEntries.map((e) => e.cardId).join(", ")}`,
        details:
          unknownEntries.length === 0
            ? undefined
            : { cardIds: unknownEntries.map((entry) => entry.cardId) },
      },
      ...deckValidation.issues.map((issue) => ({
        kind: issue.code,
        passed: false,
        message: issue.message,
        details: {
          ...(issue.cardId ? { cardId: issue.cardId } : {}),
          ...(issue.cardName ? { cardName: issue.cardName } : {}),
          ...(issue.color ? { color: issue.color } : {}),
        },
      })),
      {
        kind: "deck-size",
        passed: totalCount > 0,
        message:
          totalCount > 0 ? `Deck has ${totalCount} cards` : "Deck must contain at least 1 card",
      },
    ];

    return {
      formatId,
      label: formatLabel,
      valid: unknownEntries.length === 0 && totalCount > 0 && deckValidation.isValid,
      rules,
    };
  },

  metadata: {
    projectionVersion: 2,
    capabilities: { colors: true, deckLists: true, archetypes: true },
    facets: [
      {
        type: "ram-coalition",
        label: "RAM distribution",
        pluralLabel: "RAM distributions",
        kind: "combination",
        order: 35,
        ranking: { specialistSkill: false, mastery: false },
      },
      {
        type: "legend-lineup",
        label: "Legend lineup",
        pluralLabel: "Legend lineups",
        kind: "combination",
        order: 10,
        ranking: { specialistSkill: true, mastery: true },
      },
      {
        type: "legend",
        label: "Legend",
        pluralLabel: "Legends",
        kind: "individual",
        order: 20,
        ranking: { specialistSkill: true, mastery: true },
      },
      {
        type: "color",
        label: "Color",
        pluralLabel: "Colors",
        kind: "individual",
        order: 30,
        ranking: { specialistSkill: true, mastery: true },
      },
      {
        type: "color-combination",
        label: "Color combination",
        pluralLabel: "Color combinations",
        kind: "combination",
        order: 40,
        ranking: { specialistSkill: true, mastery: true },
      },
    ],
    projectDeck(deck) {
      const legendRam = deck.flatMap((entry) => {
        const card = cyberpunkCardsByPublicId.get(entry.cardId);
        if (!card || card.type !== "legend") return [];
        return Array.from({ length: Math.max(0, Math.floor(entry.quantity)) }, () => ({
          color: card.color,
          ram: card.ram,
        }));
      });
      const ramDistribution = deck.some((entry) => !cyberpunkCardsByPublicId.has(entry.cardId))
        ? null
        : projectRamDistribution(legendRam);
      const members = deck
        .flatMap((entry) => {
          const card = cyberpunkCardsByPublicId.get(entry.cardId);
          if (!card || card.type !== "legend") return [];
          const cardId = getCyberpunkCanonicalForCardId(entry.cardId) ?? entry.cardId;
          return Array.from({ length: Math.max(0, Math.floor(entry.quantity)) }, () => ({
            cardId,
            label: card.displayName,
            colors: card.color ? [card.color] : [],
            imageUrl: card.imageUrl,
            attributes: card.ram === null ? undefined : { ram: card.ram },
          }));
        })
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
      const colors = normalizeMetadataColors(members.flatMap((member) => member.colors));
      const individualLegends = [
        ...new Map(members.map((member) => [member.cardId, member])).values(),
      ];
      const lineup =
        members.length === 0
          ? []
          : [
              {
                type: "legend-lineup",
                key: members.map((member) => member.cardId).join("+"),
                label: members.map((member) => member.label).join(" / "),
                colors,
                members,
              },
            ];
      return {
        schemaVersion: 1,
        projectionVersion: 2,
        game: "cyberpunk",
        cardCount: deck.reduce((sum, entry) => sum + Math.max(0, Math.floor(entry.quantity)), 0),
        colors,
        facets: sortMetadataFacets([
          ...(ramDistribution ? [ramDistribution] : []),
          ...lineup,
          ...individualLegends.map((member) => ({
            type: "legend",
            key: member.cardId,
            label: member.label,
            colors: member.colors,
            members: [member],
          })),
          ...buildColorMetadataFacets(colors),
        ]),
      };
    },
    normalizeTemplate(deck) {
      return deck
        .flatMap((entry) => {
          const card = cyberpunkCardsByPublicId.get(entry.cardId);
          if (!card) return [];
          if (card.type === "legend") return [{ ...entry, quantity: 1 }];
          if (entry.quantity >= 4) return [{ ...entry, quantity: 4 }];
          if (entry.quantity >= 2) return [{ ...entry, quantity: 2 }];
          return [];
        })
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
    normalizeSynergy(deck) {
      return deck
        .filter((entry) => {
          const card = cyberpunkCardsByPublicId.get(entry.cardId);
          return card?.type !== "legend" && entry.quantity > 1;
        })
        .map((entry) => ({ ...entry, quantity: 1 }))
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
  },

  createServerEngine: cyberpunkCreateServerEngine,
  serializeEngine: cyberpunkSerializeEngine,
  restoreEngine: cyberpunkRestoreEngine,
  extractCardsMapsFromSnapshot: cyberpunkExtractCardsMapsFromSnapshot,
};
