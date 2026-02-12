import type { CharacterCard } from "@tcg/lorcana-types";

export const honestJohnNotThatHonest: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "1de-1",
      name: "EASY STREET",
      text: "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 109,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "b3edb87ace39ce0527520caef3e29894e03b5816",
  },
  franchise: "Pinocchio",
  fullName: "Honest John - Not That Honest",
  id: "1de",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Honest John",
  set: "002",
  strength: 2,
  text: "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.",
  version: "Not That Honest",
  willpower: 3,
};
