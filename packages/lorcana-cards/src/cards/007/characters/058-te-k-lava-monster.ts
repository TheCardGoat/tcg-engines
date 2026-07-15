import type { CharacterCard } from "@tcg/lorcana-types";

export const teKLavaMonster: CharacterCard = {
  abilities: [
    {
      id: "84p-1",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 58,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Deity"],
  cost: 6,
  externalIds: {
    ravensburger: "1d4dce8830332274f2d71f03712751024137f96e",
  },
  franchise: "Moana",
  fullName: "Te Kā - Lava Monster",
  id: "84p",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Te Kā",
  set: "007",
  strength: 5,
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  version: "Lava Monster",
  willpower: 6,
};
