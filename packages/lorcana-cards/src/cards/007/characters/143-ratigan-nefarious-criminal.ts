import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganNefariousCriminal: CharacterCard = {
  id: "8q4",
  cardType: "character",
  name: "Ratigan",
  version: "Nefarious Criminal",
  fullName: "Ratigan - Nefarious Criminal",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "007",
  text: "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 143,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1f72b455c62ec192fa0b46a65aa7a58a6ff89147",
  },
  abilities: [
    {
      id: "8q4-1",
      type: "triggered",
      name: "A MARVELOUS PERFORMANCE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
