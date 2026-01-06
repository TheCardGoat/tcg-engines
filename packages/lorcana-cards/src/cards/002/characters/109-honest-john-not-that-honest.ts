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
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b3edb87ace39ce0527520caef3e29894e03b5816",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};
