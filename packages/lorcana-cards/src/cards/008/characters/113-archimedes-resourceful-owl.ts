import type { CharacterCard } from "@tcg/lorcana-types";

export const archimedesResourcefulOwl: CharacterCard = {
  id: "3sv",
  cardType: "character",
  name: "Archimedes",
  version: "Resourceful Owl",
  fullName: "Archimedes - Resourceful Owl",
  inkType: ["emerald"],
  franchise: "Sword in the Stone",
  set: "008",
  text: "YOU DON'T NEED THAT When you play this character, you may banish chosen item.\nNOW, THAT'S NOT BAD During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 113,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0db41c144267742c585a92951d97cb8fbdfc7a2f",
  },
  abilities: [
    {
      id: "3sv-1",
      type: "triggered",
      name: "YOU DON'T NEED THAT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "YOU DON'T NEED THAT When you play this character, you may banish chosen item.",
    },
    {
      id: "3sv-2",
      type: "action",
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
      text: "NOW, THAT'S NOT BAD During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
