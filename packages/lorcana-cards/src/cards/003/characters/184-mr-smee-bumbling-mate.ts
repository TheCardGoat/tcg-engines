import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeBumblingMate: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression:
            "this character is exerted and you don't have a Captain character in play",
        },
        then: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "conditional",
      },
      id: "16t-1",
      text: "OH DEAR, DEAR, DEAR At the end of your turn, if this character is exerted and you don't have a Captain character in play, deal 1 damage to this character.",
      type: "action",
    },
  ],
  cardNumber: 184,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Pirate"],
  cost: 2,
  externalIds: {
    ravensburger: "9a550d6d1adb8c9c50c770cd0354b54e62316cdd",
  },
  franchise: "Peter Pan",
  fullName: "Mr. Smee - Bumbling Mate",
  id: "16t",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mr. Smee",
  set: "003",
  strength: 3,
  text: "OH DEAR, DEAR, DEAR At the end of your turn, if this character is exerted and you don't have a Captain character in play, deal 1 damage to this character.",
  version: "Bumbling Mate",
  willpower: 3,
};
