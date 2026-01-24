import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineBitterlyJealous: CharacterCard = {
  id: "1n1",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Bitterly Jealous",
  fullName: "Lady Tremaine - Bitterly Jealous",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "007",
  text: "THAT'S QUITE ENOUGH {E} — Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
  cost: 6,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 115,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "d6d17b4712d5e27c288f4076156bcc3e4c0ddb28",
  },
  abilities: [
    {
      id: "1n1-1",
      type: "activated",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "THAT'S QUITE ENOUGH {E} — Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
