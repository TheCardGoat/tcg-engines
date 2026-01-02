import type { CharacterCard } from "@tcg/lorcana-types";

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
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 39,
  inkable: true,
  externalIds: {
    ravensburger: "8c1eb6e2d2c4b6d20d3428c9522a8bb003976cda",
  },
  abilities: [
    {
      id: "12v-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
