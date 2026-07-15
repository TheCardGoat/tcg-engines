import type { CharacterCard } from "@tcg/lorcana-types";

export const zeusGodOfLightning: CharacterCard = {
  abilities: [
    {
      id: "1o1-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      id: "1o1-2",
      keyword: "Challenger",
      text: "Challenger +4",
      type: "keyword",
      value: 4,
    },
  ],
  cardNumber: 61,
  cardType: "character",
  classifications: ["Storyborn", "Deity"],
  cost: 4,
  externalIds: {
    ravensburger: "dadb267eccd432e2568673dafcf9b187459bc477",
  },
  franchise: "Hercules",
  fullName: "Zeus - God of Lightning",
  id: "1o1",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  name: "Zeus",
  set: "001",
  strength: 0,
  text: "Rush (This character can challenge the turn they're played.)\nChallenger +4 (While challenging, this character gets +4 {S}.)",
  version: "God of Lightning",
  willpower: 4,
};
