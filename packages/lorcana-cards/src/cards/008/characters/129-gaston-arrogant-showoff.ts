import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonArrogantShowoff: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["item"],
            count: "all",
            owner: "you",
            selector: "all",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "is0-1",
      name: "BREAK APART",
      text: "BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 129,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "43ad90059e880643ed35509ac9f1453d0931a266",
  },
  franchise: "Beauty and the Beast",
  fullName: "Gaston - Arrogant Showoff",
  id: "is0",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gaston",
  set: "008",
  strength: 4,
  text: "BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
  version: "Arrogant Showoff",
  willpower: 4,
};
