import type { CharacterCard } from "@tcg/lorcana-types";

export const theTwinsLostBoys: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a location in play",
          type: "if",
        },
        then: {
          amount: 2,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "conditional",
      },
      id: "hrd-1",
      name: "TWO FOR ONE",
      text: "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 186,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "400229c094343bcef39dadf5d3bcb7f65dcb9db2",
  },
  franchise: "Peter Pan",
  fullName: "The Twins - Lost Boys",
  id: "hrd",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "The Twins",
  set: "010",
  strength: 5,
  text: "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
  version: "Lost Boys",
  willpower: 5,
};
