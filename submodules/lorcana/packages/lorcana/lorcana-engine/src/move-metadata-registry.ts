/**
 * Move Metadata Registry for Lorcana
 *
 * Centralizes move labels, hotkeys, and log formatting.
 * Single source of truth for simulator and UI tooling.
 */

/**
 * Lookup function to resolve card instance ID to display name.
 */
export type CardNameLookup = (instanceId: string) => string | undefined;

/**
 * Metadata for a single move type.
 */
export interface MoveMetadata {
  id: string;
  label: string;
  hotkey?: string;
  formatLog: (
    params: Record<string, unknown>,
    cardNames: CardNameLookup,
  ) => {
    title: string;
    detail?: string;
  };
}

/**
 * Format a card reference using the lookup function.
 */
function formatWithCard(
  cardId: unknown,
  lookup: CardNameLookup,
  formatter: (name: string) => string,
): string | undefined {
  if (typeof cardId !== "string") return undefined;
  const name = lookup(cardId);
  if (!name) return undefined;
  return formatter(name);
}

/**
 * Registry of all Lorcana move metadata.
 */
export const LORCANA_MOVE_REGISTRY: MoveMetadata[] = [
  {
    id: "playCard",
    label: "Play",
    hotkey: "P",
    formatLog: (params, lookup) => {
      const cardName = formatWithCard(params.cardId, lookup, (name) => name);
      return {
        title: "Played card",
        detail: cardName ? `Played ${cardName}.` : undefined,
      };
    },
  },
  {
    id: "putCardIntoInkwell",
    label: "Ink",
    hotkey: "I",
    formatLog: (params, lookup) => {
      const cardName = formatWithCard(params.cardId, lookup, (name) => name);
      return {
        title: "Inked a card",
        detail: cardName ? `Put ${cardName} into the inkwell.` : undefined,
      };
    },
  },
  {
    id: "quest",
    label: "Quest",
    hotkey: "Q",
    formatLog: (params, lookup) => {
      const cardName = formatWithCard(params.cardId, lookup, (name) => name);
      return {
        title: "Quested",
        detail: cardName ? `Quested with ${cardName}.` : undefined,
      };
    },
  },
  {
    id: "challenge",
    label: "Challenge",
    hotkey: "C",
    formatLog: (params, lookup) => {
      const attackerName = formatWithCard(params.attackerId, lookup, (name) => name);
      const defenderName = formatWithCard(params.defenderId, lookup, (name) => name);
      return {
        title: "Challenge",
        detail:
          attackerName && defenderName
            ? `Challenged ${defenderName} with ${attackerName}.`
            : undefined,
      };
    },
  },
  {
    id: "passTurn",
    label: "Pass Turn",
    formatLog: () => ({
      title: "Passed turn",
      detail: undefined,
    }),
  },
  {
    id: "concede",
    label: "Concede",
    formatLog: () => ({
      title: "Conceded",
      detail: undefined,
    }),
  },
  {
    id: "chooseWhoGoesFirst",
    label: "Choose First Player",
    formatLog: (params) => {
      const playerId = typeof params.playerId === "string" ? params.playerId : undefined;
      return {
        title: "Chose first player",
        detail: playerId ? `Selected ${playerId} to go first.` : undefined,
      };
    },
  },
  {
    id: "alterHand",
    label: "Mulligan",
    formatLog: (params) => {
      const cardsToMulligan = params.cardsToMulligan;
      const count = Array.isArray(cardsToMulligan) ? cardsToMulligan.length : 0;
      return {
        title: "Mulligan",
        detail: count > 0 ? `Mulliganed ${count} card(s).` : "Kept hand.",
      };
    },
  },
];

/**
 * Registry map for O(1) lookup.
 */
const METADATA_BY_ID = new Map<string, MoveMetadata>(
  LORCANA_MOVE_REGISTRY.map((meta) => [meta.id, meta]),
);

/**
 * Get metadata for a specific move ID.
 */
export function getMoveMetadata(moveId: string): MoveMetadata | undefined {
  // Handle legacy move ID alias
  const normalizedId = moveId === "putACardIntoTheInkwell" ? "putCardIntoInkwell" : moveId;
  return METADATA_BY_ID.get(normalizedId);
}

/**
 * Format a move log entry with card name resolution.
 */
export function formatMoveLog(
  moveId: string,
  params: Record<string, unknown>,
  lookup: CardNameLookup,
): { title: string; detail?: string } {
  const metadata = getMoveMetadata(moveId);

  if (metadata) {
    return metadata.formatLog(params, lookup);
  }

  // Fallback for unknown moves
  return {
    title: moveId,
    detail: `Executed ${moveId}.`,
  };
}

/**
 * Get the label for a move ID.
 */
export function getMoveLabel(moveId: string): string {
  const metadata = getMoveMetadata(moveId);
  return metadata?.label ?? moveId;
}

/**
 * Get the hotkey for a move ID.
 */
export function getMoveHotkey(moveId: string): string | undefined {
  const metadata = getMoveMetadata(moveId);
  return metadata?.hotkey;
}
