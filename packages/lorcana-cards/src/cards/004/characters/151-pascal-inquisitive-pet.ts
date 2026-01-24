import type { CharacterCard } from "@tcg/lorcana-types";

export const pascalInquisitivePet: CharacterCard = {
  id: "f7s",
  cardType: "character",
  name: "Pascal",
  version: "Inquisitive Pet",
  fullName: "Pascal - Inquisitive Pet",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "004",
  text: "COLORFUL TACTICS When you play this character, look at the top 3 cards of your deck and put them back in any order.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 151,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "36d6ffd3b7830b2c8821ce4335b74e9387d55072",
  },
  abilities: [
    {
      id: "f7s-1",
      type: "triggered",
      name: "COLORFUL TACTICS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "scry",
        amount: 3,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "deck-top",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      text: "COLORFUL TACTICS When you play this character, look at the top 3 cards of your deck and put them back in any order.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
