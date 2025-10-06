import { annaTrueHearted as annaTrueheartedAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/138-anna-true-hearted";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaTruehearted: LorcanitoCharacterCardDefinition = {
  ...annaTrueheartedAsOrig,
  id: "p5i",
  reprints: [annaTrueheartedAsOrig.id],
  number: 137,
  set: "009",
};
