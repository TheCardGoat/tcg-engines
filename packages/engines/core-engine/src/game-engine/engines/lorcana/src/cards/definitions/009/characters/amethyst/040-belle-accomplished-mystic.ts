import { belleAccomplishedMystic as ogBelleAccomplishedMystic } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/036-belle-accomplished-mystic";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleAccomplishedMystic: LorcanitoCharacterCardDefinition = {
  ...ogBelleAccomplishedMystic,
  id: "cqp",
  reprints: [ogBelleAccomplishedMystic.id],
  number: 40,
  set: "009",
};
