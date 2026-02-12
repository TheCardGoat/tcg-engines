import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimSnake: CharacterCard = {
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
      id: "1tb-1",
      name: "JUST YOU WAIT",
      text: "JUST YOU WAIT When you play this character, banish her or return another chosen character of yours to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 49,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "ecab4fc40a795437b551bd71d462df6cbe7b0bce",
  },
  franchise: "Sword in the Stone",
  fullName: "Madam Mim - Snake",
  id: "1tb",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Madam Mim",
  set: "002",
  strength: 3,
  text: "JUST YOU WAIT When you play this character, banish her or return another chosen character of yours to your hand.",
  version: "Snake",
  willpower: 3,
};
