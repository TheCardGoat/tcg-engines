import type { CharacterCard } from "@tcg/lorcana-types";

export const honestJohnNotThatHonest: CharacterCard = {
  id: "1de",
  cardType: "character",
  name: "Honest John",
  version: "Not That Honest",
  fullName: "Honest John - Not That Honest",
  inkType: ["ruby"],
  franchise: "Pinocchio",
  set: "002",
  text: "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 109,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b3edb87ace39ce0527520caef3e29894e03b5816",
  },
  abilities: [
    {
      id: "1de-1",
      type: "triggered",
      name: "EASY STREET",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
