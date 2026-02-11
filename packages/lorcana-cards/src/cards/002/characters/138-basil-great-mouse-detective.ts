import type { CharacterCard } from "@tcg/lorcana-types";

export const basilGreatMouseDetective: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1vg-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
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
      id: "1vg-2",
      text: "THERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.",
      type: "static",
    },
  ],
  cardNumber: 138,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Detective"],
  cost: 6,
  externalIds: {
    ravensburger: "f3066e534c839456566a4571a3fe088026b39ce7",
  },
  franchise: "Great Mouse Detective",
  fullName: "Basil - Great Mouse Detective",
  id: "1vg",
  inkType: ["sapphire"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Basil",
  set: "002",
  strength: 3,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Basil.)\nTHERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.",
  version: "Great Mouse Detective",
  willpower: 4,
};
