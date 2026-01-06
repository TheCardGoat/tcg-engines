import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const drFacilier: CharacterCard = {
  id: "fov",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Charlatan",
  fullName: "Dr. Facilier - Charlatan",
  inkType: [
    "amethyst",
  ],
  franchise: "General",
  set: "001",
  text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 38,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 494099,
  },
  classifications: [
    "Sorcerer",
    "Storyborn",
    "Villain",
  ],
  abilities: [
    {
      type: "static",
      effect: {
          type: "restriction",
          restriction: "cant-sing",
          target: "SELF",
        },
      id: "fov-1",
      text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
    },
  ],
};
