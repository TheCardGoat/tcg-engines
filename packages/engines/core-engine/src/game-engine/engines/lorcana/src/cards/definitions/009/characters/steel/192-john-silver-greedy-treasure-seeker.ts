import { johnSilverGreedyTreasureSeeker as ogJohnSilverGreedyTreasureSeeker } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const johnSilverGreedyTreasureSeeker: LorcanaCharacterCardDefinition = {
  ...ogJohnSilverGreedyTreasureSeeker,
  id: "vpb",
  reprints: [ogJohnSilverGreedyTreasureSeeker.id],
  number: 192,
  set: "009",
};
