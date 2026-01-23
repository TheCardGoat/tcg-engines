import type { CharacterCard } from "@tcg/lorcana-types";

export const teKLavaMonster: CharacterCard = {
  id: "84p",
  cardType: "character",
  name: "Te Kā",
  version: "Lava Monster",
  fullName: "Te Kā - Lava Monster",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "007",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 58,
  inkable: true,
  externalIds: {
    ravensburger: "1d4dce8830332274f2d71f03712751024137f96e",
  },
  abilities: [
    {
      id: "84p-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
};
