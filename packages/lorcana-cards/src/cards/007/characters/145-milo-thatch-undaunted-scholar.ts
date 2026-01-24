import type { CharacterCard } from "@tcg/lorcana-types";

export const miloThatchUndauntedScholar: CharacterCard = {
  id: "1ah",
  cardType: "character",
  name: "Milo Thatch",
  version: "Undaunted Scholar",
  fullName: "Milo Thatch - Undaunted Scholar",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "007",
  text: "I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 145,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a781b1576f0db15a070fa749c5764a5d0fb543d0",
  },
  abilities: [
    {
      id: "1ah-1",
      type: "triggered",
      name: "I'M YOUR GUY",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "play-card",
        from: "hand",
        cardType: "action",
      },
      text: "I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
