import type { CharacterCard } from "@tcg/lorcana";

export const teKLavaMonster: CharacterCard = {
  id: "84p",
  cardType: "character",
  name: "Te Kā",
  version: "Lava Monster",
  fullName: "Te Kā - Lava Monster",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "007",
  text: "Challenger +2 (While challenging, this character gets +2.)",
  cardNumber: "058",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "1d4dce8830332274f2d71f03712751024137f96e",
  },
  keywords: [
    {
      type: "Challenger",
      value: 2,
    },
  ],
  abilities: [
    {
      id: "84pa1",
      text: "Challenger +2",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
};
