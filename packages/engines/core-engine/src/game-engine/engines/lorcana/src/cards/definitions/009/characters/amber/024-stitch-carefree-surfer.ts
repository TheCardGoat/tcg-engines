import { stichtCarefreeSurfer as ogStichtCarefreeSurfer } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/021-stitch-carefree-surfer";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchCarefreeSurfer: LorcanitoCharacterCardDefinition = {
  ...ogStichtCarefreeSurfer,
  id: "jdo",
  reprints: [ogStichtCarefreeSurfer.id],
  number: 24,
  set: "009",
};
