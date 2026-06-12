import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaOfMotunui as canonicalMoanaOfMotunui } from "../../001";

export const moanaOfMotunui: CharacterCard = {
  ...canonicalMoanaOfMotunui,
  id: "lsO",
  reprints: ["set1-014", "set9-020"],
  set: "009",
  cardNumber: 20,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_612c000e0f7047659edee1e275069811",
    tcgPlayer: 649968,
  },
};
