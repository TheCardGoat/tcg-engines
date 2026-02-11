import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarWickedSorcerer: CharacterCard = {
  abilities: [
    {
      id: "1dn-1",
      keyword: "Challenger",
      text: "Challenger +3",
      type: "keyword",
      value: 3,
    },
  ],
  cardNumber: 45,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "b3001090c82926f995dda5332ff5f0546257b061",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Wicked Sorcerer",
  id: "1dn",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Jafar",
  set: "001",
  strength: 2,
  text: "Challenger +3 (While challenging, this character gets +3 {S}.)",
  version: "Wicked Sorcerer",
  willpower: 5,
};
