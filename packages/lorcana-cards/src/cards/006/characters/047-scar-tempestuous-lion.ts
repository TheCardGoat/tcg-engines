import type { CharacterCard } from "@tcg/lorcana-types";

export const scarTempestuousLion: CharacterCard = {
  abilities: [
    {
      id: "ug5-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      id: "ug5-2",
      keyword: "Challenger",
      text: "Challenger +3",
      type: "keyword",
      value: 3,
    },
  ],
  cardNumber: 47,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 6,
  externalIds: {
    ravensburger: "6dbd6b03dc064b8f9f8f15ddaa470e7b5632a534",
  },
  franchise: "Lion King",
  fullName: "Scar - Tempestuous Lion",
  id: "ug5",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  name: "Scar",
  set: "006",
  strength: 4,
  text: "Rush (This character can challenge the turn they're played.)\nChallenger +3 (While challenging, this character gets +3 {S}.)",
  version: "Tempestuous Lion",
  willpower: 4,
};
