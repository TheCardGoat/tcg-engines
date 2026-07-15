import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineBitterlyJealous: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "return-to-hand",
      },
      id: "1n1-1",
      text: "THAT'S QUITE ENOUGH {E} — Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
      type: "activated",
    },
  ],
  cardNumber: 115,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 6,
  externalIds: {
    ravensburger: "d6d17b4712d5e27c288f4076156bcc3e4c0ddb28",
  },
  franchise: "Cinderella",
  fullName: "Lady Tremaine - Bitterly Jealous",
  id: "1n1",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Lady Tremaine",
  set: "007",
  strength: 3,
  text: "THAT'S QUITE ENOUGH {E} — Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
  version: "Bitterly Jealous",
  willpower: 3,
};
