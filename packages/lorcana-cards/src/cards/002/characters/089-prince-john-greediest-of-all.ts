import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnGreediestOfAll: CharacterCard = {
  abilities: [
    {
      id: "9so-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "9so-2",
      name: "I SENTENCE YOU",
      text: "I SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 89,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "234f106f9cda1365ed6739c2c2de43bb307ce2a2",
  },
  franchise: "Robin Hood",
  fullName: "Prince John - Greediest of All",
  id: "9so",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Prince John",
  set: "002",
  strength: 1,
  text: "Ward (Opponents can't choose this character except to challenge.)\nI SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
  version: "Greediest of All",
  willpower: 2,
};
