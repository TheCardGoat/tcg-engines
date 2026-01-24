import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloFaithfulPet: CharacterCard = {
  id: "1tx",
  cardType: "character",
  name: "Diablo",
  version: "Faithful Pet",
  fullName: "Diablo - Faithful Pet",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "003",
  text: "LOOKING FOR AURORA Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 37,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ed97dc8603ee549c8cb27492b9b46a29191afdaf",
  },
  abilities: [
    {
      id: "1tx-1",
      type: "triggered",
      name: "LOOKING FOR AURORA",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "LOOKING FOR AURORA Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
