import type { ItemCard } from "@tcg/lorcana-types";

export const kanineKrunchies: ItemCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "willpower",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "3wn-1",
      text: "YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.",
      type: "static",
    },
  ],
  cardNumber: 43,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "0e14bb8a862da981efa44f59d4328c79ee92dba1",
  },
  franchise: "101 Dalmatians",
  id: "3wn",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Kanine Krunchies",
  set: "007",
  text: "YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.",
};
