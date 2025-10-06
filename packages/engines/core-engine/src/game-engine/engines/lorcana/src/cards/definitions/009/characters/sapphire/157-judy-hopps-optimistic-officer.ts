import { judyHoppsOptimisticOfficer as judyHoppsOptimisticOfficerAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/152-judy-hopps-optimistic-officer";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const judyHoppsOptimisticOfficer: LorcanaCharacterCardDefinition = {
  ...judyHoppsOptimisticOfficerAsOrig,
  id: "bcu",
  reprints: [judyHoppsOptimisticOfficerAsOrig.id],
  number: 157,
  set: "009",
};
