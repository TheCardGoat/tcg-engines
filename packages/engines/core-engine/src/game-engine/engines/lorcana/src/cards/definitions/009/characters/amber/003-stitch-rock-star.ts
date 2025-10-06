import { stitchRockStar as ogStitchRockStar } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/023-stitch-rock-star";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchRockStar: LorcanaCharacterCardDefinition = {
  ...ogStitchRockStar,
  id: "yom",
  reprints: [ogStitchRockStar.id],
  number: 3,
  set: "009",
};
