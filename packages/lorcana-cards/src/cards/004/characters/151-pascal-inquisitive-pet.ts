import type { CharacterCard } from "@tcg/lorcana-types";

export const pascalInquisitivePet: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 3,
        destinations: [
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-top",
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      id: "f7s-1",
      name: "COLORFUL TACTICS",
      text: "COLORFUL TACTICS When you play this character, look at the top 3 cards of your deck and put them back in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 151,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "36d6ffd3b7830b2c8821ce4335b74e9387d55072",
  },
  franchise: "Tangled",
  fullName: "Pascal - Inquisitive Pet",
  id: "f7s",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pascal",
  set: "004",
  strength: 3,
  text: "COLORFUL TACTICS When you play this character, look at the top 3 cards of your deck and put them back in any order.",
  version: "Inquisitive Pet",
  willpower: 3,
};
