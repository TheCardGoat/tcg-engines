import type { CharacterCard } from "@tcg/lorcana-types";

export const archimedesExceptionalOwl: CharacterCard = {
  id: "crp",
  cardType: "character",
  name: "Archimedes",
  version: "Exceptional Owl",
  fullName: "Archimedes - Exceptional Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "007",
  text: "MORE TO LEARN Whenever an opponent chooses this character for an action or ability, you may draw a card.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 76,
  inkable: true,
  externalIds: {
    ravensburger: "2e059909be50ae3de97d3674f118f6da8e648180",
  },
  abilities: [
    {
      id: "crp-1",
      name: "MORE TO LEARN",
      type: "triggered",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
