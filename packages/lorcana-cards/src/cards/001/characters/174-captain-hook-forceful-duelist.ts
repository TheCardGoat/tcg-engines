import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const captainHook: CharacterCard = {
  id: "uk5",
  cardType: "character",
  name: "Captain Hook",
  version: "Forceful Duelist",
  fullName: "Captain Hook - Forceful Duelist",
  inkType: [
    "steel",
  ],
  franchise: "Peter Pan",
  set: "001",
  text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 174,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 492704,
  },
  classifications: [
    "Dreamborn",
    "Villain",
    "Pirate",
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
      id: "uk5-1",
      text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
    },
  ],
};
