import type { CharacterCard } from "@tcg/lorcana-types";

export const archimedesExceptionalOwl: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "crp-1",
      name: "MORE TO LEARN",
      text: "MORE TO LEARN Whenever an opponent chooses this character for an action or ability, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 76,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "2e059909be50ae3de97d3674f118f6da8e648180",
  },
  franchise: "Sword in the Stone",
  fullName: "Archimedes - Exceptional Owl",
  id: "crp",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Archimedes",
  set: "007",
  strength: 2,
  text: "MORE TO LEARN Whenever an opponent chooses this character for an action or ability, you may draw a card.",
  version: "Exceptional Owl",
  willpower: 2,
};
