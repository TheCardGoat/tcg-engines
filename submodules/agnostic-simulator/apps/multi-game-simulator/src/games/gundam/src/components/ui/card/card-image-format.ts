export type ImageFormat = "full" | "art_only";

export const CARD_IMAGE_DIMENSIONS: Record<ImageFormat, { width: number; height: number }> = {
  full: { width: 734, height: 1024 },
  art_only: { width: 734, height: 602 },
};

export const CARD_IMAGE_ASPECT_RATIOS: Record<ImageFormat, number> = {
  full: CARD_IMAGE_DIMENSIONS.full.width / CARD_IMAGE_DIMENSIONS.full.height,
  art_only: CARD_IMAGE_DIMENSIONS.art_only.width / CARD_IMAGE_DIMENSIONS.art_only.height,
};

export type CardSize = "micro" | "tiny" | "small" | "small-plus" | "medium" | "large" | "x-large";

export const CARD_SIZE_SCALES: Record<CardSize, number> = {
  micro: 1 / 12,
  tiny: 1 / 8,
  small: 1 / 6,
  "small-plus": 1 / 4,
  medium: 1 / 2,
  large: 1,
  "x-large": 5 / 4,
};

export const ZONE_IMAGE_FORMATS: Record<string, ImageFormat> = {
  deck: "art_only",
  hand: "full",
  play: "full",
  discard: "art_only",
  hangar: "art_only",
  resource: "art_only",
};

export function resolveCardDimensions(
  size?: CardSize,
  scale?: number,
  imageFormat: ImageFormat = "full",
): { displayWidth: number; displayHeight: number; effectiveScale: number } {
  const { width: baseW, height: baseH } = CARD_IMAGE_DIMENSIONS[imageFormat];
  const effectiveScale = size ? CARD_SIZE_SCALES[size] : (scale ?? CARD_SIZE_SCALES.small);
  return {
    displayWidth: Math.round(baseW * effectiveScale),
    displayHeight: Math.round(baseH * effectiveScale),
    effectiveScale,
  };
}

const CDN_BASE = "https://r2.tcg.online/public/gundam/cards";

export function buildCardImageUrl(set: string, cardNumber: string): string {
  // `cardNumber` already carries the set prefix in Gundam data ("ST01-008").
  // The CDN path keeps the set directory lowercase and the filename uppercase.
  const setLower = set.toLowerCase();
  const filename = cardNumber.toUpperCase();
  return `${CDN_BASE}/${setLower}/${filename}.webp`;
}
