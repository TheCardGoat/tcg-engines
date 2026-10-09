import type { CardsMaps, DeckBuildInput } from "./types.js";

/** Expand already-resolved deck rows without conflating card and printing identity.
 * Game adapters retain ownership of identity resolution and setup semantics.
 */
export function materializeDeckInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
  const cardInstances: Record<string, string> = {};
  const owners: Record<string, string[]> = {};
  const instanceSections: Record<string, string> = {};
  const printingIdByInstanceId: Record<string, string> = {};
  for (const { owner, deck } of decks) {
    if (Object.hasOwn(owners, owner)) throw new Error(`Duplicate deck owner: ${owner}`);
    const instances: string[] = [];
    let counter = 0;
    for (const entry of deck) {
      if (!Number.isSafeInteger(entry.qty) || entry.qty < 0) {
        throw new Error(`Invalid deck quantity for ${entry.cardId}: ${entry.qty}`);
      }
      for (let copy = 0; copy < entry.qty; copy++) {
        const instanceId = `${owner}-${entry.cardId}-${counter++}`;
        if (Object.hasOwn(cardInstances, instanceId)) {
          throw new Error(`Duplicate card instance: ${instanceId}`);
        }
        cardInstances[instanceId] = entry.cardId;
        instances.push(instanceId);
        if (entry.sectionId) instanceSections[instanceId] = entry.sectionId;
        if (entry.printingId) printingIdByInstanceId[instanceId] = entry.printingId;
      }
    }
    owners[owner] = instances;
  }
  return {
    cardInstances,
    owners,
    ...(Object.keys(instanceSections).length ? { instanceSections } : {}),
    ...(Object.keys(printingIdByInstanceId).length
      ? { presentation: { printingIdByInstanceId } }
      : {}),
  };
}
