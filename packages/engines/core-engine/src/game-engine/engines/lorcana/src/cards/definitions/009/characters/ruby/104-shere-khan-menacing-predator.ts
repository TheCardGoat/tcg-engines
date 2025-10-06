import { shereKhanMenacingPredator as ogShereKhanMenacingPredator } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/126-shere-khan-menacing-predator";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const shereKhanMenacingPredator: LorcanitoCharacterCardDefinition = {
  ...ogShereKhanMenacingPredator,
  id: "nzy",
  reprints: [ogShereKhanMenacingPredator.id],
  number: 104,
  set: "009",
};
