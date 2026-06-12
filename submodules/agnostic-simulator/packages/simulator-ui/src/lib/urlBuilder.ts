import type { GameSlug } from "@tcg/simulator-contract";

export interface CardImageUrlParams {
  gameSlug: GameSlug;
  cardId: string;
  setCode?: string;
  language?: string;
  size?: "small" | "medium" | "large" | "full";
}

const CDN_BASE = "https://r2.tcg.online";

const GAME_PATHS: Record<GameSlug, string> = {
  "one-piece": "one-piece/cards",
  gundam: "gundam/cards",
  cyberpunk: "cyberpunk/cards",
  lorcana: "lorcana/cards",
};

const SIZE_SUFFIXES: Record<string, string> = {
  small: "_sm",
  medium: "_md",
  large: "_lg",
  full: "",
};

/**
 * Build a card image URL from game slug and card identifiers.
 * Falls back to a pattern-based URL if no direct URL is provided.
 */
export function buildCardImageUrl(params: CardImageUrlParams): string {
  const { gameSlug, cardId, setCode, language = "en", size = "medium" } = params;

  const gamePath = GAME_PATHS[gameSlug];
  const sizeSuffix = SIZE_SUFFIXES[size] ?? SIZE_SUFFIXES.medium;

  if (setCode) {
    return `${CDN_BASE}/${gamePath}/${language}/${setCode}/${cardId}${sizeSuffix}.webp`;
  }

  return `${CDN_BASE}/${gamePath}/${language}/${cardId}${sizeSuffix}.webp`;
}

/**
 * Resolve an entity's image URL. If the entity already has a direct URL,
 * return it. Otherwise build one from the game slug and entity ID.
 */
export function resolveEntityImageUrl(
  entity: { id: string; imageUrl?: string },
  gameSlug: GameSlug,
  options?: Omit<CardImageUrlParams, "gameSlug" | "cardId">,
): string | undefined {
  if (entity.imageUrl) {
    return entity.imageUrl;
  }

  return buildCardImageUrl({
    gameSlug,
    cardId: entity.id,
    ...options,
  });
}
