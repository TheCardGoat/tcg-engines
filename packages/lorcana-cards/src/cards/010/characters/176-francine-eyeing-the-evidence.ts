import type { CharacterCard } from "@tcg/lorcana";

export const francineEyeingTheEvidence: CharacterCard = {
  id: "1bg",
  cardType: "character",
  name: "Francine",
  version: "Eyeing the Evidence",
  fullName: "Francine - Eyeing the Evidence",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  cardNumber: "176",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "ab013cade204fc90400f1cb148720c2a1914fe37",
  },
  keywords: [
    {
      type: "Resist",
      value: 1,
    },
  ],
  abilities: [
    {
      id: "1bga1",
      text: "Resist +1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
};
