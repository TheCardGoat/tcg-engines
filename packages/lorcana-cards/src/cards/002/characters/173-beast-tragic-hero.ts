import type { CharacterCard } from "@tcg/lorcana";

export const beastTragicHero: CharacterCard = {
  id: "kyf",
  cardType: "character",
  name: "Beast",
  version: "Tragic Hero",
  fullName: "Beast - Tragic Hero",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Beast.)\nIT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 173,
  inkable: true,
  externalIds: {
    ravensburger: "4b874fe55f677240c7632e1507c8b94e37428079",
  },
  abilities: [
    {
      id: "kyf-1",
      text: "Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "kyf-2",
      text: "IT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
      name: "IT'S BETTER THIS WAY",
      type: "triggered",
      trigger: {
        event: "start-turn",
        timing: "at",
        on: "YOU",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "no-damage",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
};
