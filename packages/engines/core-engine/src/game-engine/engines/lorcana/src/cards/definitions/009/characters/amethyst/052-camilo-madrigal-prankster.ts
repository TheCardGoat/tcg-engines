import { camiloMadrigalPrankster as ogCamiloMadrigalPrankster } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/040-camilo-madrigal-prankster";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const camiloMadrigalPrankster: LorcanaCharacterCardDefinition = {
  ...ogCamiloMadrigalPrankster,
  id: "bij",
  reprints: [ogCamiloMadrigalPrankster.id],
  number: 52,
  set: "009",
};
