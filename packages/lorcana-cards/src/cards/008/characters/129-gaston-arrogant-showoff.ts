import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonArrogantShowoff: CharacterCard = {
  id: "is0",
  cardType: "character",
  name: "Gaston",
  version: "Arrogant Showoff",
  fullName: "Gaston - Arrogant Showoff",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "008",
  text: "BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 129,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "43ad90059e880643ed35509ac9f1453d0931a266",
  },
  abilities: [
    {
      id: "is0-1",
      type: "triggered",
      name: "BREAK APART",
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
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
