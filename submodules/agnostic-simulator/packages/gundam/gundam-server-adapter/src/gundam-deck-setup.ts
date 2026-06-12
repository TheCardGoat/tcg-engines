import type { CardsMaps } from "@tcg/shared/game-adapter";

interface GundamDeckCatalog {
  get(definitionId: string): { type?: string } | undefined;
}

/**
 * Slot a flat sequence of definition IDs (the shared cardsMaps shape) into
 * Gundam's main-deck / resource-deck split.
 *
 * The shared adapter contract delivers per-instance owner lists; Gundam's
 * Player shape needs two definition-id arrays. We classify by reading the
 * card definition's `type` - `resource` cards go to the resource deck,
 * everything else to the main deck. Unknown definitions fall back to the
 * main deck so a missing catalog entry doesn't silently lose cards.
 */
export function splitDeckByType(
  ownerInstanceIds: string[],
  cardsMaps: CardsMaps,
  catalog: GundamDeckCatalog,
): { deck: string[]; resourceDeck: string[] } {
  const deck: string[] = [];
  const resourceDeck: string[] = [];
  for (const instanceId of ownerInstanceIds) {
    const definitionId = cardsMaps.cardInstances[instanceId];
    if (!definitionId) continue;
    const def = catalog.get(definitionId);
    if (def?.type === "resource") {
      resourceDeck.push(definitionId);
    } else {
      deck.push(definitionId);
    }
  }
  return { deck, resourceDeck };
}
