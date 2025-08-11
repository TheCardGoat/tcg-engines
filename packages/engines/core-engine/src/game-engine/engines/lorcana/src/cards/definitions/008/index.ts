import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export * from "./actions";
export * from "./characters";
export * from "./items";

import * as actions008 from "~/game-engine/engines/lorcana/src/cards/definitions/008/actions";

export const all008Cards: LorcanaCardDefinition[] = Object.values(actions008);

export const all008CardsById: Record<string, LorcanaCardDefinition> = {};

for (const card of all008Cards) {
  all008CardsById[card.id] = card;
}
