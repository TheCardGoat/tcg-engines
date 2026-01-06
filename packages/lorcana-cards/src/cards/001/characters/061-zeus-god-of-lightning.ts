import type { CharacterCard } from "@tcg/lorcana-types";

export const zeusGodOfLightning: CharacterCard = {
  id: "1o1",
  cardType: "character",
  name: "Zeus",
  version: "God of Lightning",
  fullName: "Zeus - God of Lightning",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)\nChallenger +4 (While challenging, this character gets +4 {S}.)",
  cost: 4,
  strength: 0,
  willpower: 4,
  lore: 2,
  cardNumber: 61,
  inkable: false,
  externalIds: {
    ravensburger: "dadb267eccd432e2568673dafcf9b187459bc477",
  },
  abilities: [
    {
      id: "1o1-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "1o1-2",
      type: "keyword",
      keyword: "Challenger",
      value: 4,
      text: "Challenger +4",
    },
  ],
  classifications: ["Storyborn", "Deity"],
};
