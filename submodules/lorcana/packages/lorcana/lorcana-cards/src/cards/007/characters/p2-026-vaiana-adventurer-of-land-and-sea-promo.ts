import type { CharacterCard } from "@tcg/lorcana-types";
import { vaianaAdventurerOfLandAndSeaP2PromoI18n } from "./p2-026-vaiana-adventurer-of-land-and-sea-promo.i18n";

export const vaianaAdventurerOfLandAndSeaP2Promo: CharacterCard = {
  id: "HtH",
  canonicalId: "ci_HtH",
  slug: "lorcana-ci_HtH",
  printings: [
    {
      id: "set7-p2-026-promo-2",
      artId: "ci_HtH-promo",
      setCode: "set7",
      collectorNumber: "26",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set7-p2-026-promo-2"],
  cardType: "character",
  name: "Vaiana",
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
  classifications: ["Storyborn", "Hero", "Princess"],
  i18n: vaianaAdventurerOfLandAndSeaP2PromoI18n,
};
