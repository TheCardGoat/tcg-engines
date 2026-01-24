import type { CharacterCard } from "@tcg/lorcana-types";

export const theTwinsLostBoys: CharacterCard = {
  id: "hrd",
  cardType: "character",
  name: "The Twins",
  version: "Lost Boys",
  fullName: "The Twins - Lost Boys",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "010",
  text: "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 186,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "400229c094343bcef39dadf5d3bcb7f65dcb9db2",
  },
  abilities: [
    {
      id: "hrd-1",
      type: "triggered",
      name: "TWO FOR ONE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a location in play",
        },
        then: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
