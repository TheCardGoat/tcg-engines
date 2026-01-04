import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarWickedSorcerer: CharacterCard = {
  id: "1dn",
  cardType: "character",
  name: "Jafar",
  version: "Wicked Sorcerer",
  fullName: "Jafar - Wicked Sorcerer",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "001",
  text: "Challenger +3 (While challenging, this character gets +3 {S}.)",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  externalIds: {
    ravensburger: "b3001090c82926f995dda5332ff5f0546257b061",
  },
  abilities: [
    {
      id: "1dn-1",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
