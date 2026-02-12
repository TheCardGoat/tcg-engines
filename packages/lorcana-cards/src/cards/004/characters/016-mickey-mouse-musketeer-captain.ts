import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseMusketeerCaptain: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "8qn-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play him",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      id: "8qn-3",
      name: "MUSKETEERS UNITED",
      text: "MUSKETEERS UNITED When you play this character, if you used Shift to play him, you may draw a card for each character with Bodyguard you have in play.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Musketeer", "Captain"],
  cost: 7,
  externalIds: {
    ravensburger: "1f7fdffbe44a423876467063b69dc2d789758da9",
  },
  fullName: "Mickey Mouse - Musketeer Captain",
  id: "8qn",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Mickey Mouse",
  set: "004",
  strength: 3,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nBodyguard, Support\nMUSKETEERS UNITED When you play this character, if you used Shift to play him, you may draw a card for each character with Bodyguard you have in play.",
  version: "Musketeer Captain",
  willpower: 6,
};
