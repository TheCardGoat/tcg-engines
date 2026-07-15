/**
 * Asset URL helpers for Lorcana card skeleton UI.
 * All assets are served from the configured simulator asset base.
 */

import { buildSimulatorAssetUrl } from "$lib/config/public-url-config.js";

/**
 * Get the URL for an ink symbol SVG.
 * @param ink - The ink type (e.g., "amber", "ruby", "sapphire")
 */
export function getInkSymbolUrl(ink: string): string {
  return buildSimulatorAssetUrl(`inks/${ink.toLowerCase()}.svg`);
}

export function getRarityIconUrl(rarity: string): string {
  // Convert super_rare to super-rare for URL
  const normalizedRarity = rarity.toLowerCase().replace(/_/g, "-");
  return buildSimulatorAssetUrl(`rarity/${normalizedRarity}.webp`);
}

export function getStatIconUrl(stat: "strength" | "defense"): string {
  return buildSimulatorAssetUrl(`symbols/${stat}.svg`);
}

export function getStatSmallIconUrl(stat: "strength" | "defense"): string {
  return buildSimulatorAssetUrl(
    `symbols/${stat === "defense" ? "willpower-2" : "strength-simple-2"}.svg`,
  );
}

export function getCostWithBgIconUrl(): string {
  return buildSimulatorAssetUrl("symbols/ink-cost.svg");
}

export function getCostIconUrl(): string {
  return buildSimulatorAssetUrl("symbols/cost.svg");
}

export function getCostIconSmallUrl(): string {
  return buildSimulatorAssetUrl("symbols/ink-simple-2.svg");
}

export function getLoreIconUrl(): string {
  return buildSimulatorAssetUrl("symbols/lore-2.svg");
}

export function getExertIconUrl(): string {
  return buildSimulatorAssetUrl("symbols/exert.svg");
}

export function getInkableIconUrl(inkable?: boolean): string {
  return buildSimulatorAssetUrl(`symbols/${inkable ? "inkpot" : "non-inkwell-2"}.svg`);
}

export function getMoveCostIconUrl(): string {
  return buildSimulatorAssetUrl("symbols/move-cost.png");
}
