import type { CharacterCard } from "@tcg/lorcana-types";

export const basilGreatMouseDetective: CharacterCard = {
  id: "1vg",
  cardType: "character",
  name: "Basil",
  version: "Great Mouse Detective",
  fullName: "Basil - Great Mouse Detective",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Basil.)\nTHERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  cardNumber: 138,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f3066e534c839456566a4571a3fe088026b39ce7",
  },
  abilities: [
    {
      id: "1vg-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "1vg-2",
      type: "static",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play this character",
        },
        then: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
      },
      text: "THERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
};
