import type { CharacterCard } from "@tcg/lorcana-types";

export const beastTragicHero: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "kyf-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "this character has no damage",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
      id: "kyf-2",
      text: "IT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 173,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Prince"],
  cost: 5,
  externalIds: {
    ravensburger: "4b874fe55f677240c7632e1507c8b94e37428079",
  },
  franchise: "Beauty and the Beast",
  fullName: "Beast - Tragic Hero",
  id: "kyf",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Beast",
  set: "002",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Beast.)\nIT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
  version: "Tragic Hero",
  willpower: 5,
};
