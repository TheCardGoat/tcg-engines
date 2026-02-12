import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenDiviner: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        condition: {
          type: "if",
          expression: "that item costs 3 or less",
        },
        then: {
          type: "restriction",
          restriction: "enters-play-exerted",
          target: "SELF",
        },
        type: "conditional",
      },
      id: "aeu-1",
      text: "CONSULT THE SPELLBOOK {E} — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item costs 3 or less, you may play it for free instead and it enters play exerted. Put the rest on the bottom of your deck in any order.",
      type: "activated",
    },
  ],
  cardNumber: 156,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Queen", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "25872e2f6a7538f1bad704261005852bd2804752",
  },
  franchise: "Snow White",
  fullName: "The Queen - Diviner",
  id: "aeu",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Queen",
  set: "004",
  strength: 3,
  text: "CONSULT THE SPELLBOOK {E} — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item costs 3 or less, you may play it for free instead and it enters play exerted. Put the rest on the bottom of your deck in any order.",
  version: "Diviner",
  willpower: 3,
};
