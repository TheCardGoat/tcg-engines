/**
 * Game-scoped card image CDN config and URL resolution.
 * One config per game; Lorcana uses R2 CDN with formats and language fallback.
 *
 * @module cards/cdn-config
 */

// ============================================================================
// Types
// ============================================================================

export interface CardImageFormat {
  id: string;
  label: string;
  width: number;
  height: number;
  pathPattern: string;
}

export interface GameCardImageConfig {
  baseUrl: string;
  formats: CardImageFormat[];
  /** Lorcana: supported language codes for path (uppercase). */
  supportedLanguages?: readonly string[];
  /** Lorcana: fallback when language is not supported. */
  defaultLanguage?: string;
}

export interface ResolveCardImageUrlParams {
  language?: string;
  set: string;
  cardNumber: string;
}

// ============================================================================
// Lorcana config (R2 CDN)
// ============================================================================

const LORCANA_SUPPORTED_LANGUAGES = ["FR", "EN", "DE", "IT"] as const;
const LORCANA_DEFAULT_LANGUAGE = "EN";

const LORCANA_FORMATS: CardImageFormat[] = [
  {
    id: "full",
    label: "Full card",
    width: 734,
    height: 1024,
    pathPattern: "{language}/{set}/{cardNumber}.webp",
  },
  {
    id: "art_only",
    label: "Art only",
    width: 734,
    height: 602,
    pathPattern: "{set}/art_only/{cardNumber}.webp",
  },
  {
    id: "art_and_name",
    label: "Art and name",
    width: 734,
    height: 766,
    pathPattern: "{language}/{set}/art_and_name/{cardNumber}.webp",
  },
];

const LORCANA_CONFIG: GameCardImageConfig = {
  baseUrl: "https://r2.tcg.online/public/lorcana/",
  formats: LORCANA_FORMATS,
  supportedLanguages: LORCANA_SUPPORTED_LANGUAGES,
  defaultLanguage: LORCANA_DEFAULT_LANGUAGE,
};

// ============================================================================
// Gundam config (R2 CDN)
// ============================================================================

const GUNDAM_FORMATS: CardImageFormat[] = [
  {
    id: "full",
    label: "Full card",
    width: 734,
    height: 1024,
    pathPattern: "cards/{set}/{cardNumber}.webp",
  },
];

const GUNDAM_CONFIG: GameCardImageConfig = {
  baseUrl: "https://r2.tcg.online/public/gundam/",
  formats: GUNDAM_FORMATS,
};

const GAME_CONFIGS: Record<string, GameCardImageConfig> = {
  lorcana: LORCANA_CONFIG,
  gundam: GUNDAM_CONFIG,
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * Normalize language for Lorcana: must be one of FR, EN, DE, IT; otherwise EN.
 */
function normalizeLorcanaLanguage(language: string | undefined): string {
  if (!language || typeof language !== "string") {
    return LORCANA_DEFAULT_LANGUAGE;
  }
  const upper = language.toUpperCase().slice(0, 2);
  if (upper === "EN" || upper === "FR" || upper === "DE" || upper === "IT") {
    return upper;
  }
  // Map locale codes like "en-US", "fr-FR" to first two chars
  const code = language.slice(0, 2).toUpperCase();
  if (LORCANA_SUPPORTED_LANGUAGES.includes(code as (typeof LORCANA_SUPPORTED_LANGUAGES)[number])) {
    return code;
  }
  return LORCANA_DEFAULT_LANGUAGE;
}

/**
 * Convert lorcana-cards set id (e.g. "set1", "set11") to R2 path segment (e.g. "001", "011").
 */
export function setIdToR2Segment(setId: string): string {
  const match = /^set(\d+)$/i.exec(setId);
  const segment = match?.[1];
  if (segment !== undefined) {
    const num = parseInt(segment, 10);
    return num.toString().padStart(3, "0");
  }
  // Fallback: use as-is (e.g. quest1, gateway1 could be mapped later)
  return setId;
}

/**
 * Zero-pad card number to 3 digits for R2 path.
 */
export function cardNumberToR2Segment(cardNumber: number | string): string {
  const n = typeof cardNumber === "string" ? parseInt(cardNumber, 10) : cardNumber;
  if (Number.isNaN(n)) {
    return String(cardNumber);
  }
  return n.toString().padStart(3, "0");
}

// ============================================================================
// Resolver
// ============================================================================

/**
 * Resolve a card image URL for a game and format using the game's CDN config.
 * For Lorcana: language is normalized to FR|EN|DE|IT (fallback EN).
 *
 * @param game - Game key (e.g. "lorcana")
 * @param formatId - Format id (e.g. "full", "art_only", "art_and_name")
 * @param params - set and cardNumber (path segments); optional language for Lorcana
 * @returns Full image URL, or empty string if game/format not configured
 */
export function resolveCardImageUrl(
  game: string,
  formatId: string,
  params: ResolveCardImageUrlParams,
): string {
  const config = GAME_CONFIGS[game];
  if (!config) {
    return "";
  }

  const format = config.formats.find((f) => f.id === formatId);
  if (!format) {
    return "";
  }

  let path = format.pathPattern;

  // Substitute {language} for formats that use it (Lorcana: full, art_and_name)
  if (path.includes("{language}")) {
    const lang =
      config.supportedLanguages && config.defaultLanguage
        ? normalizeLorcanaLanguage(params.language)
        : (params.language ?? config.defaultLanguage ?? "EN").toUpperCase().slice(0, 2);
    path = path.replace(/\{language\}/g, lang);
  }

  path = path.replace(/\{set\}/g, params.set);
  path = path.replace(/\{cardNumber\}/g, params.cardNumber);

  const base = config.baseUrl.replace(/\/$/, "");
  const segment = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${segment}`;
}

/**
 * Get the CDN config for a game (for consumers that need format list or base URL).
 */
export function getGameCardImageConfig(game: string): GameCardImageConfig | undefined {
  return GAME_CONFIGS[game];
}

/**
 * Get the aspect ratio (width / height) for a game's image format.
 * Use for preserving correct proportions when rendering card images (e.g. CSS aspect-ratio).
 * Returns undefined if game or format is not configured.
 */
export function getFormatAspectRatio(game: string, formatId: string): number | undefined {
  const config = GAME_CONFIGS[game];
  if (!config) return undefined;
  const format = config.formats.find((f) => f.id === formatId);
  if (!format || format.height === 0) return undefined;
  return format.width / format.height;
}

/**
 * Get width and height for a game's image format (for intrinsic size or aspect-ratio).
 */
export function getFormatDimensions(
  game: string,
  formatId: string,
): { width: number; height: number } | undefined {
  const config = GAME_CONFIGS[game];
  if (!config) return undefined;
  const format = config.formats.find((f) => f.id === formatId);
  if (!format) return undefined;
  return { width: format.width, height: format.height };
}
