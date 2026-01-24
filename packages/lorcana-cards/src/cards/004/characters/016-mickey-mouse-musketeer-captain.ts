import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseMusketeerCaptain: CharacterCard = {
  id: "8qn",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Musketeer Captain",
  fullName: "Mickey Mouse - Musketeer Captain",
  inkType: ["amber"],
  set: "004",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nBodyguard, Support\nMUSKETEERS UNITED When you play this character, if you used Shift to play him, you may draw a card for each character with Bodyguard you have in play.",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 16,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1f7fdffbe44a423876467063b69dc2d789758da9",
  },
  abilities: [
    {
      id: "8qn-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "8qn-3",
      type: "triggered",
      name: "MUSKETEERS UNITED",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "MUSKETEERS UNITED When you play this character, if you used Shift to play him, you may draw a card for each character with Bodyguard you have in play.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Musketeer", "Captain"],
};
