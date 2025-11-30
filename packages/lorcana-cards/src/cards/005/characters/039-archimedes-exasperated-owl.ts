import type { CharacterCard } from "@tcg/lorcana";

export const archimedesExasperatedOwl: CharacterCard = {
  id: "12v",
  cardType: "character",
  name: "Archimedes",
  version: "Exasperated Owl",
  fullName: "Archimedes - Exasperated Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "039",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "8c1eb6e2d2c4b6d20d3428c9522a8bb003976cda",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "12va1",
      text: "Evasive",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
