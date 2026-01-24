import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnGreediestOfAll: CharacterCard = {
  id: "9so",
  cardType: "character",
  name: "Prince John",
  version: "Greediest of All",
  fullName: "Prince John - Greediest of All",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "002",
  text: "Ward (Opponents can't choose this character except to challenge.)\nI SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 89,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "234f106f9cda1365ed6739c2c2de43bb307ce2a2",
  },
  abilities: [
    {
      id: "9so-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "9so-2",
      type: "triggered",
      name: "I SENTENCE YOU",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "I SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Prince"],
};
