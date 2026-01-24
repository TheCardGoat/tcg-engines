import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarNewlyCrowned: CharacterCard = {
  id: "1i1",
  cardType: "character",
  name: "Jafar",
  version: "Newly Crowned",
  fullName: "Jafar - Newly Crowned",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "007",
  text: "THIS IS NOT DONE YET During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 51,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c2c99cc57b2bf9c36b9c67847831c8544b963b06",
  },
  abilities: [
    {
      id: "1i1-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "THIS IS NOT DONE YET During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
