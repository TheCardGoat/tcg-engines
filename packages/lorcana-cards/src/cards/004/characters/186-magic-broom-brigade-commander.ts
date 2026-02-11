import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomBrigadeCommander: CharacterCard = {
  abilities: [
    {
      id: "pct-1",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "pct-2",
      text: "ARMY OF BROOMS This character gets +2 {S} for each other character named Magic Broom you have in play.",
      type: "static",
    },
  ],
  cardNumber: 186,
  cardType: "character",
  classifications: ["Dreamborn", "Broom"],
  cost: 6,
  externalIds: {
    ravensburger: "5b62db7d0c2cf0af385d111c8e065a46ee86e2da",
  },
  franchise: "Fantasia",
  fullName: "Magic Broom - Brigade Commander",
  id: "pct",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Magic Broom",
  set: "004",
  strength: 2,
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nARMY OF BROOMS This character gets +2 {S} for each other character named Magic Broom you have in play.",
  version: "Brigade Commander",
  willpower: 6,
};
