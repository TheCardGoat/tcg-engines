import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimElephant: CharacterCard = {
  id: "gma",
  cardType: "character",
  name: "Madam Mim",
  version: "Elephant",
  fullName: "Madam Mim - Elephant",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "A LITTLE GAME When you play this character, banish her or return another chosen character of yours to your hand.\nSNEAKY MOVE At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
  cost: 4,
  strength: 3,
  willpower: 7,
  lore: 1,
  cardNumber: 44,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3be540ae6b1e1b0bbf8aa74167e10c34c7f76a20",
  },
  abilities: [
    {
      id: "gma-1",
      type: "triggered",
      name: "A LITTLE GAME",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "A LITTLE GAME When you play this character, banish her or return another chosen character of yours to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
