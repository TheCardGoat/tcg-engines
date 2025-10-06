import { belleUntrainedMystic as ogBelleUntrainedMystic } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/037-belle-untrained-mystic";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleUntrainedMystic: LorcanitoCharacterCardDefinition = {
  ...ogBelleUntrainedMystic,
  id: "k6t",
  reprints: [ogBelleUntrainedMystic.id],
  number: 39,
  set: "009",
};
