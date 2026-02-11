import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganNefariousCriminal: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "8q4-1",
      name: "A MARVELOUS PERFORMANCE",
      text: "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 143,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "1f72b455c62ec192fa0b46a65aa7a58a6ff89147",
  },
  franchise: "Great Mouse Detective",
  fullName: "Ratigan - Nefarious Criminal",
  id: "8q4",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Ratigan",
  set: "007",
  strength: 3,
  text: "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.",
  version: "Nefarious Criminal",
  willpower: 3,
};
