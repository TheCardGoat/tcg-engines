import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaAdventurerOfLandAndSeaP2PromoI18n } from "./p2-026-moana-adventurer-of-land-and-sea-promo.i18n";

export const moanaAdventurerOfLandAndSeaP2Promo: CharacterCard = {
  id: "sUn",
  canonicalId: "ci_MeA",
  slug: "lorcana-ci_MeA",
  printings: [
    {
      id: "set7-p2-026-promo",
      artId: "ci_MeA-promo",
      setCode: "set7",
      collectorNumber: "26",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set7-156"],
  cardType: "character",
  name: "Moana",
  version: "Adventurer of Land and Sea",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "007",
  cardNumber: 26,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 1,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_2e61b6cfa0da4f32a21cc3375e0855b1",
    tcgPlayer: "618357",
  },
  classifications: ["Storyborn", "Hero", "Princess"],
  i18n: moanaAdventurerOfLandAndSeaP2PromoI18n,
};
