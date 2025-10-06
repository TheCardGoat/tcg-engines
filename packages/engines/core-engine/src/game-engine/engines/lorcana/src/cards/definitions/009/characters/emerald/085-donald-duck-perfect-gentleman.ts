import { donaldDuckPerfectGentleman as donaldDuckPerfectGentlemanAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/077-donald-duck-perfect-gentleman";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckPerfectGentleman: LorcanitoCharacterCardDefinition = {
  ...donaldDuckPerfectGentlemanAsOrig,
  id: "g8a",
  reprints: [donaldDuckPerfectGentlemanAsOrig.id],
  number: 85,
  set: "009",
};
