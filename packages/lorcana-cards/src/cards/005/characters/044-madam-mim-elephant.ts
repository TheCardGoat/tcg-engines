import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimElephant: CharacterCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "return-to-hand",
      },
      id: "gma-1",
      name: "A LITTLE GAME",
      text: "A LITTLE GAME When you play this character, banish her or return another chosen character of yours to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 44,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "3be540ae6b1e1b0bbf8aa74167e10c34c7f76a20",
  },
  franchise: "Sword in the Stone",
  fullName: "Madam Mim - Elephant",
  id: "gma",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Madam Mim",
  set: "005",
  strength: 3,
  text: "A LITTLE GAME When you play this character, banish her or return another chosen character of yours to your hand.\nSNEAKY MOVE At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
  version: "Elephant",
  willpower: 7,
};
