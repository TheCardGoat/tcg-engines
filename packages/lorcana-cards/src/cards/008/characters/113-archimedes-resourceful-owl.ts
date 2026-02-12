import type { CharacterCard } from "@tcg/lorcana-types";

export const archimedesResourcefulOwl: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      id: "3sv-1",
      name: "YOU DON'T NEED THAT",
      text: "YOU DON'T NEED THAT When you play this character, you may banish chosen item.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      id: "3sv-2",
      text: "NOW, THAT'S NOT BAD During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
      type: "action",
    },
  ],
  cardNumber: 113,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "0db41c144267742c585a92951d97cb8fbdfc7a2f",
  },
  franchise: "Sword in the Stone",
  fullName: "Archimedes - Resourceful Owl",
  id: "3sv",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Archimedes",
  set: "008",
  strength: 2,
  text: "YOU DON'T NEED THAT When you play this character, you may banish chosen item.\nNOW, THAT'S NOT BAD During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
  version: "Resourceful Owl",
  willpower: 2,
};
