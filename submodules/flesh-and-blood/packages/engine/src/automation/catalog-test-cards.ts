import type { FabCardDefinitionInput } from "../cards.ts";
import { generatedCatalogTestCards } from "./catalog-test-cards.generated.ts";

/**
 * Bounded fixture program generated from the official catalog.
 *
 * Runtime fixture routes must not resolve these names through the repository-
 * wide card registry. Regenerate intentionally when this named test set changes.
 */
export const catalogTestCards = generatedCatalogTestCards;

export const ids = Object.fromEntries(
  Object.entries(catalogTestCards).map(([key, definition]) => [key, definition.canonicalId]),
) as { readonly [K in keyof typeof catalogTestCards]: string };

export const catalogIds = ids;

export const CATALOG_TEST_DEFINITIONS: Record<string, FabCardDefinitionInput> = Object.fromEntries(
  Object.values(catalogTestCards).map((definition) => [definition.canonicalId, definition]),
);
