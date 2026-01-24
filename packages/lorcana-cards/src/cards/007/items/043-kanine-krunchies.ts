import type { ItemCard } from "@tcg/lorcana-types";

export const kanineKrunchies: ItemCard = {
  id: "3wn",
  cardType: "item",
  name: "Kanine Krunchies",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.",
  cost: 1,
  cardNumber: 43,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0e14bb8a862da981efa44f59d4328c79ee92dba1",
  },
  abilities: [
    {
      id: "3wn-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      text: "YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.",
    },
  ],
};
