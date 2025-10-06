import { stitchAlienDancer as ogStitchAlienDancer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/23-stitch-alien-dancer";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchAlienDancer: LorcanitoCharacterCardDefinition = {
  ...ogStitchAlienDancer,
  id: "g0k",
  reprints: [ogStitchAlienDancer.id],
  number: 9,
  set: "009",
};
