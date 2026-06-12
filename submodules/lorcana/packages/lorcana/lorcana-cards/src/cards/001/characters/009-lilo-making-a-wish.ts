import type { CharacterCard } from "@tcg/lorcana-types";
import { liloMakingAWishI18n } from "./009-lilo-making-a-wish.i18n";

export const liloMakingAWish: CharacterCard = {
  id: "Svq",
  canonicalId: "ci_Svq",
  reprints: ["set1-009"],
  cardType: "character",
  name: "Lilo",
  version: "Making a Wish",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "001",
  cardNumber: 9,
  rarity: "rare",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0ccbea0b8fd54779939f56e1fcc3769a",
    tcgPlayer: 503315,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: liloMakingAWishI18n,
};
