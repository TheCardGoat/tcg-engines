import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchHighBadnessLevelP3PromoI18n } from "./p3-035-stitch-high-badness-level-promo.i18n";

export const stitchHighBadnessLevelP3Promo: CharacterCard = {
  id: "563",
  canonicalId: "ci_u0n",
  slug: "lorcana-ci_u0n",
  printings: [
    {
      id: "set11-p3-035-promo",
      artId: "ci_u0n-promo",
      setCode: "set11",
      collectorNumber: "35",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set11-185"],
  cardType: "character",
  name: "Stitch",
  version: "High Badness Level",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 35,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e2cac54dd5d4e0ea2db87cf752df00a",
    tcgPlayer: "673335",
  },
  text: [
    {
      title: "AMPED UP",
      description:
        "While you have a character named Lilo in play, this character gains Challenger +3. (They get +3 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
  abilities: [
    {
      id: "qzq-1",
      condition: {
        type: "has-named-character",
        name: "Lilo",
        controller: "you",
      },
      effect: {
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 3,
      },
      name: "AMPED UP",
      type: "static",
      text: "AMPED UP While you have a character named Lilo in play, this character gains Challenger +3.",
    },
  ],
  i18n: stitchHighBadnessLevelP3PromoI18n,
};
