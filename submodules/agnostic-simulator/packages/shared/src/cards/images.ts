/**
 * Card Image Resolution Library
 *
 * Provides utilities for resolving card images across different TCGs.
 * Supports multiple image sizes, sources, and fallback strategies.
 *
 * @module cards/images
 *
 * @example
 * ```typescript
 * import { resolveCardImage, ImageSize, ImageFormat } from '@tcg/shared/cards/images';
 *
 * const imageUrl = resolveCardImage({
 *   size: ImageSize.NORMAL,
 *   lorcastId: 'crd_abc123',
 *   ravensburgerUrl: 'https://api.lorcana.ravensburger.com/images/...'
 * });
 * ```
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Image size variants
 */
export enum ImageSize {
  /** Small thumbnail (card list views) */
  SMALL = "small",
  /** Normal size (card details, deck building) */
  NORMAL = "normal",
  /** Large size (full card view, zoom) */
  LARGE = "large",
  /** Art crop (just the illustration) */
  ART_CROP = "art_crop",
}

/**
 * Image format types
 */
export enum ImageFormat {
  /** AVIF format (modern, smaller size) */
  AVIF = "avif",
  /** JPEG format (universal compatibility) */
  JPEG = "jpg",
  /** WebP format (good compression) */
  WEBP = "webp",
}

/**
 * Image variant types (regular vs foil)
 */
export enum ImageVariant {
  /** Regular card image */
  REGULAR = "regular",
  /** Foil card image */
  FOIL = "foil",
}

/**
 * Image source priorities
 */
export enum ImageSource {
  /** Lorcast CDN (preferred, multiple sizes) */
  LORCAST = "lorcast",
  /** Ravensburger official API */
  RAVENSBURGER = "ravensburger",
  /** Direct URL (fallback) */
  DIRECT = "direct",
}

/**
 * Card image references
 * Contains all possible image identifiers for a card
 */
export interface CardImageRefs {
  /** Lorcast card ID (e.g., "crd_abc123") */
  lorcastId?: string;
  /** Ravensburger image URL */
  ravensburgerUrl?: string;
  /** Direct image URL fallback */
  directUrl?: string;
  /** Foil mask URL (for foil variants) */
  foilMaskUrl?: string;
}

/**
 * Resolved image URLs for all sizes
 */
export interface ResolvedImages {
  small?: string;
  normal?: string;
  large?: string;
  artCrop?: string;
}

/**
 * Image resolution options
 */
export interface ImageResolutionOptions {
  /** Target image size */
  size?: ImageSize;
  /** Image format preference */
  format?: ImageFormat;
  /** Regular or foil variant */
  variant?: ImageVariant;
  /** Source priority order */
  sourcePriority?: ImageSource[];
  /** Include cache-busting timestamp */
  cacheBust?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

/** Lorcast CDN base URL */
const LORCAST_CDN_BASE = "https://cards.lorcast.io/card/digital";

/** Default image resolution options */
const DEFAULT_OPTIONS: ImageResolutionOptions = {
  size: ImageSize.NORMAL,
  format: ImageFormat.AVIF,
  variant: ImageVariant.REGULAR,
  sourcePriority: [ImageSource.LORCAST, ImageSource.RAVENSBURGER, ImageSource.DIRECT],
  cacheBust: false,
};

/** Size to path segment mapping for Lorcast */
const LORCAST_SIZE_PATHS: Record<ImageSize, string> = {
  [ImageSize.SMALL]: "small",
  [ImageSize.NORMAL]: "normal",
  [ImageSize.LARGE]: "large",
  [ImageSize.ART_CROP]: "art_crop",
};

// ============================================================================
// URL Builders
// ============================================================================

/**
 * Build Lorcast CDN URL for a card
 *
 * @param lorcastId - Lorcast card ID
 * @param size - Image size
 * @param format - Image format
 * @returns Full CDN URL
 */
export function buildLorcastUrl(
  lorcastId: string,
  size: ImageSize = ImageSize.NORMAL,
  format: ImageFormat = ImageFormat.AVIF,
): string {
  const sizePath = LORCAST_SIZE_PATHS[size];
  const ext = format === ImageFormat.AVIF ? "avif" : format;
  return `${LORCAST_CDN_BASE}/${sizePath}/${lorcastId}.${ext}`;
}

/**
 * Build Lorcast CDN URLs for all sizes
 *
 * @param lorcastId - Lorcast card ID
 * @param format - Image format
 * @returns Object with URLs for all sizes
 */
export function buildLorcastUrls(
  lorcastId: string,
  format: ImageFormat = ImageFormat.AVIF,
): ResolvedImages {
  return {
    small: buildLorcastUrl(lorcastId, ImageSize.SMALL, format),
    normal: buildLorcastUrl(lorcastId, ImageSize.NORMAL, format),
    large: buildLorcastUrl(lorcastId, ImageSize.LARGE, format),
    artCrop: buildLorcastUrl(lorcastId, ImageSize.ART_CROP, format),
  };
}

// ============================================================================
// Image Resolution
// ============================================================================

/**
 * Resolve a single card image URL
 *
 * Tries sources in priority order and returns the first valid URL.
 *
 * @param refs - Card image references
 * @param options - Resolution options
 * @returns Resolved image URL or undefined if no source available
 *
 * @example
 * ```typescript
 * const url = resolveCardImage(
 *   { lorcastId: 'crd_abc123' },
 *   { size: ImageSize.NORMAL }
 * );
 * // Returns: "https://cards.lorcast.io/card/digital/normal/crd_abc123.avif"
 * ```
 */
export function resolveCardImage(
  refs: CardImageRefs,
  options: ImageResolutionOptions = {},
): string | undefined {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { size, format, sourcePriority } = opts;

  for (const source of sourcePriority!) {
    switch (source) {
      case ImageSource.LORCAST:
        if (refs.lorcastId) {
          return buildLorcastUrl(refs.lorcastId, size, format);
        }
        break;

      case ImageSource.RAVENSBURGER:
        if (refs.ravensburgerUrl) {
          // Ravensburger URLs are typically fixed size, return as-is
          return refs.ravensburgerUrl;
        }
        break;

      case ImageSource.DIRECT:
        if (refs.directUrl) {
          return refs.directUrl;
        }
        break;
    }
  }

  return undefined;
}

/**
 * Resolve all image sizes for a card
 *
 * @param refs - Card image references
 * @param options - Resolution options
 * @returns Resolved images for all sizes
 *
 * @example
 * ```typescript
 * const images = resolveAllCardImages(
 *   { lorcastId: 'crd_abc123' },
 *   { format: ImageFormat.AVIF }
 * );
 * // Returns: { small: "...", normal: "...", large: "...", artCrop: "..." }
 * ```
 */
export function resolveAllCardImages(
  refs: CardImageRefs,
  options: Omit<ImageResolutionOptions, "size"> = {},
): ResolvedImages {
  const { format } = { ...DEFAULT_OPTIONS, ...options };

  // If we have a Lorcast ID, we can build all sizes
  if (refs.lorcastId) {
    return buildLorcastUrls(refs.lorcastId, format);
  }

  // Otherwise, use the same URL for all sizes (from Ravensburger or direct)
  const singleUrl = resolveCardImage(refs, { ...options, size: ImageSize.NORMAL });

  return {
    small: singleUrl,
    normal: singleUrl,
    large: singleUrl,
    artCrop: singleUrl,
  };
}

// ============================================================================
// Image Transformations
// ============================================================================

/**
 * Add cache-busting timestamp to URL
 *
 * @param url - Original URL
 * @returns URL with cache-busting query param
 */
export function addCacheBusting(url: string): string {
  const timestamp = Date.now();
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${timestamp}`;
}

/**
 * Convert image URL to a different size
 * Only works for Lorcast URLs
 *
 * @param url - Original image URL
 * @param targetSize - Target size
 * @returns URL with new size or original URL if not Lorcast
 */
export function convertImageSize(url: string, targetSize: ImageSize): string {
  // Check if it's a Lorcast URL
  if (!url.includes(LORCAST_CDN_BASE)) {
    return url;
  }

  // Replace size segment in URL
  const sizePattern = new RegExp(`/(${Object.values(LORCAST_SIZE_PATHS).join("|")})/`);
  const newSizePath = LORCAST_SIZE_PATHS[targetSize];
  return url.replace(sizePattern, `/${newSizePath}/`);
}

/**
 * Get the next larger image size
 * Useful for responsive images
 *
 * @param size - Current size
 * @returns Next larger size or undefined if already largest
 */
export function getLargerSize(size: ImageSize): ImageSize | undefined {
  const sizeOrder = [ImageSize.SMALL, ImageSize.NORMAL, ImageSize.LARGE];
  const currentIndex = sizeOrder.indexOf(size);
  return sizeOrder[currentIndex + 1];
}

/**
 * Get the next smaller image size
 *
 * @param size - Current size
 * @returns Next smaller size or undefined if already smallest
 */
export function getSmallerSize(size: ImageSize): ImageSize | undefined {
  const sizeOrder = [ImageSize.SMALL, ImageSize.NORMAL, ImageSize.LARGE];
  const currentIndex = sizeOrder.indexOf(size);
  return sizeOrder[currentIndex - 1];
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Check if a URL is a valid image URL
 *
 * @param url - URL to check
 * @returns True if looks like a valid image URL
 */
export function isValidImageUrl(url: string | undefined): url is string {
  if (!url) return false;

  // Check for common image extensions or known CDN patterns
  const imagePatterns = [
    /\.(avif|webp|jpg|jpeg|png|gif)(\?.*)?$/i,
    /cards\.lorcast\.io/,
    /lorcana\.ravensburger\.com/,
  ];

  return imagePatterns.some((pattern) => pattern.test(url));
}

/**
 * Validate card image references
 *
 * @param refs - Image references to validate
 * @returns Validation result with available sources
 */
export function validateImageRefs(refs: CardImageRefs): {
  isValid: boolean;
  availableSources: ImageSource[];
  recommendedSource: ImageSource | undefined;
} {
  const availableSources: ImageSource[] = [];

  if (refs.lorcastId) availableSources.push(ImageSource.LORCAST);
  if (refs.ravensburgerUrl) availableSources.push(ImageSource.RAVENSBURGER);
  if (refs.directUrl) availableSources.push(ImageSource.DIRECT);

  return {
    isValid: availableSources.length > 0,
    availableSources,
    recommendedSource: availableSources[0],
  };
}

// ============================================================================
// Game-Specific Helpers
// ============================================================================

/**
 * Build image refs from Lorcana canonical card data
 *
 * @param card - Lorcana canonical card with externalIds
 * @returns Card image references
 */
export function buildLorcanaImageRefs(card: { externalIds?: { lorcast?: string } }): CardImageRefs {
  return {
    lorcastId: card.externalIds?.lorcast,
  };
}

/**
 * Build image refs from Ravensburger input card
 *
 * @param card - Ravensburger input card
 * @returns Card image references
 */
export function buildRavensburgerImageRefs(card: {
  thumbnail_url?: string;
  variants?: Array<{ detail_image_url?: string }>;
}): CardImageRefs {
  return {
    ravensburgerUrl: card.variants?.[0]?.detail_image_url || card.thumbnail_url,
  };
}
