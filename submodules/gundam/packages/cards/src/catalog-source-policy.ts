import { GUNDAM_EN_US_PRODUCT_RELEASES } from "./catalog-release.ts";

export const GUNDAM_ROLLING_SOURCE_NAMESPACES = [
  "basic-cards",
  "other-product-card",
  "promotion-card",
] as const;

export type GundamRollingSourceNamespace = (typeof GUNDAM_ROLLING_SOURCE_NAMESPACES)[number];

export interface GundamPublisherReleaseEventEvidence {
  kind: "publisher_product_release_event";
  productSetCodes: readonly string[];
  sourceLabel: string;
}

interface GundamObservedSourcePrinting {
  getIt?: string;
}

function isRollingSourceNamespace(value: string): value is GundamRollingSourceNamespace {
  return (GUNDAM_ROLLING_SOURCE_NAMESPACES as readonly string[]).includes(value);
}

/**
 * Scope a printing from a rolling publisher namespace to explicit product
 * release evidence.
 *
 * Rolling buckets mix cards from many products and events, so they must never
 * inherit one release date. We only accept a publisher `getIt` label when it:
 *
 * - identifies the distribution as a release event, and
 * - names one or more bracketed product codes already present in the audited
 *   EN-US product release registry.
 *
 * Generic event labels and product codes without audited release facts remain
 * unresolved. The caller resolves dates from the product registry; this
 * policy does not invent or duplicate dates.
 */
export function getGundamRollingPrintingReleaseEvidence(
  sourceSetId: string,
  printing: GundamObservedSourcePrinting,
): GundamPublisherReleaseEventEvidence | null {
  const normalizedSourceSetId = sourceSetId.trim().toLowerCase();
  if (!isRollingSourceNamespace(normalizedSourceSetId)) return null;

  const sourceLabel = printing.getIt?.trim();
  if (!sourceLabel || !/\brelease event\b/i.test(sourceLabel)) return null;

  const bracketedCodes = [...sourceLabel.matchAll(/\[([A-Z0-9-]+)\]/gi)].map((match) =>
    match[1].toUpperCase(),
  );
  if (bracketedCodes.length === 0) return null;

  const productSetCodes = [...new Set(bracketedCodes)];
  if (productSetCodes.some((setCode) => !Object.hasOwn(GUNDAM_EN_US_PRODUCT_RELEASES, setCode))) {
    return null;
  }

  return {
    kind: "publisher_product_release_event",
    productSetCodes,
    sourceLabel,
  };
}
