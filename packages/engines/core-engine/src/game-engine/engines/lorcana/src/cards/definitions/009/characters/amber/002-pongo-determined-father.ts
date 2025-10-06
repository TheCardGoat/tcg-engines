import { pongoDeterminedFather as ogPongoDeterminedFather } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pongoDeterminedFather: LorcanaCharacterCardDefinition = {
  ...ogPongoDeterminedFather,
  id: "nn4",
  reprints: [ogPongoDeterminedFather.id],
  number: 2,
  set: "009",
};
