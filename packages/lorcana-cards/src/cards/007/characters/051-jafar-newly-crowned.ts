import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarNewlyCrowned: CharacterCard = {
  abilities: [
    {
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
      id: "1i1-1",
      text: "THIS IS NOT DONE YET During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
      type: "action",
    },
  ],
  cardNumber: 51,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "c2c99cc57b2bf9c36b9c67847831c8544b963b06",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Newly Crowned",
  id: "1i1",
  inkType: ["amethyst", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jafar",
  set: "007",
  strength: 2,
  text: "THIS IS NOT DONE YET During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
  version: "Newly Crowned",
  willpower: 4,
};
