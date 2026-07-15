import type { CharacterCard } from "@tcg/lorcana-types";

export const floraGoodFairy: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "awe-1",
      text: "FIDDLE FADDLE While being challenged, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 75,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy"],
  cost: 3,
  externalIds: {
    ravensburger: "2748ac33fb9196c968a8b393fdd03e40908589e4",
  },
  franchise: "Sleeping Beauty",
  fullName: "Flora - Good Fairy",
  id: "awe",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Flora",
  set: "005",
  strength: 2,
  text: "FIDDLE FADDLE While being challenged, this character gets +2 {S}.",
  version: "Good Fairy",
  willpower: 4,
};
