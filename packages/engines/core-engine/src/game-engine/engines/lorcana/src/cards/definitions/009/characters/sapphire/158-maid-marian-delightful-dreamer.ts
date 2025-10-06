import { ladyMarianAdorableDreamer } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maidMarianDelightfulDreamer: LorcanitoCharacterCardDefinition = {
  ...ladyMarianAdorableDreamer,
  id: "c8w",
  reprints: [ladyMarianAdorableDreamer.id],
  number: 158,
  set: "009",
};
