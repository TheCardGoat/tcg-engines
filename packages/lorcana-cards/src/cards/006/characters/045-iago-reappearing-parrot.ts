import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoReappearingParrot: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      id: "tre-1",
      name: "GUESS WHO",
      text: "GUESS WHO When this character is banished in a challenge, return this card to your hand.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 45,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "6b429fee312a65704722d56f090cd9bbe69ea8ae",
  },
  franchise: "Aladdin",
  fullName: "Iago - Reappearing Parrot",
  id: "tre",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Iago",
  set: "006",
  strength: 4,
  text: "GUESS WHO When this character is banished in a challenge, return this card to your hand.",
  version: "Reappearing Parrot",
  willpower: 2,
};
