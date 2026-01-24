import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimSnake: CharacterCard = {
  id: "1tb",
  cardType: "character",
  name: "Madam Mim",
  version: "Snake",
  fullName: "Madam Mim - Snake",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "JUST YOU WAIT When you play this character, banish her or return another chosen character of yours to your hand.",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ecab4fc40a795437b551bd71d462df6cbe7b0bce",
  },
  abilities: [
    {
      id: "1tb-1",
      type: "triggered",
      name: "JUST YOU WAIT",
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
      text: "JUST YOU WAIT When you play this character, banish her or return another chosen character of yours to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
