import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloFaithfulPet: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "1tx-1",
      name: "LOOKING FOR AURORA",
      text: "LOOKING FOR AURORA Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 37,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "ed97dc8603ee549c8cb27492b9b46a29191afdaf",
  },
  franchise: "Sleeping Beauty",
  fullName: "Diablo - Faithful Pet",
  id: "1tx",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Diablo",
  set: "003",
  strength: 2,
  text: "LOOKING FOR AURORA Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  version: "Faithful Pet",
  willpower: 1,
};
