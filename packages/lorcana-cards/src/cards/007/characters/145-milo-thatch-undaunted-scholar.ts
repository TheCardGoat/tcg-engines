import type { CharacterCard } from "@tcg/lorcana-types";

export const miloThatchUndauntedScholar: CharacterCard = {
  abilities: [
    {
      effect: {
        cardType: "action",
        from: "hand",
        type: "play-card",
      },
      id: "1ah-1",
      name: "I'M YOUR GUY",
      text: "I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "action",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 145,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "a781b1576f0db15a070fa749c5764a5d0fb543d0",
  },
  franchise: "Atlantis",
  fullName: "Milo Thatch - Undaunted Scholar",
  id: "1ah",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Milo Thatch",
  set: "007",
  strength: 2,
  text: "I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.",
  version: "Undaunted Scholar",
  willpower: 2,
};
