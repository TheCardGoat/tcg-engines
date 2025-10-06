import { johnSilverAlienPirate as ogJohnSilverAlienPirate } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/082-john-silver-alien-pirate";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const johnSilverAlienPirate: LorcanitoCharacterCardDefinition = {
  ...ogJohnSilverAlienPirate,
  id: "hsz",
  reprints: [ogJohnSilverAlienPirate.id],
  number: 89,
  set: "009",
};
