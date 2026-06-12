import type { CardDefinition } from "@tcg/cyberpunk-types";
import type { CardCatalog } from "../types/match-state.ts";

let registry: CardCatalog | null = null;
const overlay = new Map<string, CardDefinition>();

export function setCardRegistry(catalog: CardCatalog): void {
  registry = catalog;
  overlay.clear();
}

export function clearCardRegistry(): void {
  registry = null;
  overlay.clear();
}

export function getCardRegistry(): CardCatalog {
  if (!registry) {
    throw new Error(
      "Card registry not initialized. Call setCardRegistry() (or createMatchState which does it for you) before looking up definitions.",
    );
  }
  return registry;
}

export function tryGetDefinition(definitionId: string): CardDefinition | undefined {
  return overlay.get(definitionId) ?? registry?.get(definitionId);
}

export function getDefinition(definitionId: string): CardDefinition {
  const def = tryGetDefinition(definitionId);
  if (!def) throw new Error(`Card definition not found in registry: ${definitionId}`);
  return def;
}

/**
 * Overlay a definition for a single id. Only intended for tests that need to
 * tweak a specific card's stats; cleared on the next `setCardRegistry` call.
 * The id is the definition's `id` field; pass a fully-formed CardDefinition.
 */
export function overrideDefinition(def: CardDefinition): void {
  overlay.set(def.id, def);
}

export function clearDefinitionOverride(definitionId: string): void {
  overlay.delete(definitionId);
}
