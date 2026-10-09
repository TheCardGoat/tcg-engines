import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearSpaceRangerP3PromoI18n } from "./p3-057-buzz-lightyear-space-ranger-promo.i18n";

export const buzzLightyearSpaceRangerP3Promo: CharacterCard = {
  id: "H3x",
  canonicalId: "ci_Gb4",
  slug: "lorcana-ci_Gb4",
  printings: [
    {
      id: "set12-p3-057-promo",
      artId: "ci_Gb4-promo",
      setCode: "set12",
      collectorNumber: "57",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set12-076"],
  cardType: "character",
  name: "Buzz Lightyear",
  version: "Space Ranger",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 57,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_dc61d69860c541f6bca41a4a9b8c17f1",
    tcgPlayer: "692208",
  },
  classifications: ["Storyborn", "Hero", "Toy", "Captain"],
  i18n: buzzLightyearSpaceRangerP3PromoI18n,
};
