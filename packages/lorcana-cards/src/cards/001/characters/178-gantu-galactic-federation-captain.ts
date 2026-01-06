import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const gantu: CharacterCard = {
  id: "ucw",
  cardType: "character",
  name: "Gantu",
  version: "Galactic Federation Captain",
  fullName: "Gantu - Galactic Federation Captain",
  inkType: [
    "steel",
  ],
  franchise: "General",
  set: "001",
  text: "**Under arrest** Characters with cost 2 or less can't challenge your characters.",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 178,
  inkable: true,
  rarity: "legendary",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 488097,
  },
  classifications: [
    "Alien",
    "Storyborn",
    "Captain",
  ],
  abilities: [
    {
      type: "static",
      effect: {
          type: "restriction",
          restriction: "cant-sing",
          target: "SELF",
        },
      id: "ucw-1",
      text: "Characters with cost [object Object] or less can't challenge this character.",
    },
  ],
};
