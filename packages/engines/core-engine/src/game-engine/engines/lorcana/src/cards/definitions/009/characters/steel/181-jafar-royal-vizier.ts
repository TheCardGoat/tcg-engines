import { jafarRoyalVizier as jafarRoyalVizierAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/184-jafar-royal-vizier";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarRoyalVizier: LorcanaCharacterCardDefinition = {
  ...jafarRoyalVizierAsOrig,
  id: "xva",
  reprints: [jafarRoyalVizierAsOrig.id],
  number: 181,
  set: "009",
};
