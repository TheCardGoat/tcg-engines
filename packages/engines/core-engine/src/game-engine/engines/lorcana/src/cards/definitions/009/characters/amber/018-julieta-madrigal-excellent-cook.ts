import { julietaMadrigalExcellentCook as ogJulietaMadrigalExcellentCook } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/13-julieta-madrigal-excellent-cook";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const julietaMadrigalExcellentCook: LorcanaCharacterCardDefinition = {
  ...ogJulietaMadrigalExcellentCook,
  id: "gxo",
  reprints: [ogJulietaMadrigalExcellentCook.id],
  number: 18,
  set: "009",
};
