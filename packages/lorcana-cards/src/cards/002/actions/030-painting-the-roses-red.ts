import type { ActionCard } from "@tcg/lorcana-types";

export const paintingTheRosesRed: ActionCard = {
  id: "2ft",
  cardType: "action",
  name: "Painting the Roses Red",
  inkType: ["amber"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 30,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "003e83f940426d943bddbae6a42d20fe26abf042",
  },
  abilities: [],
};
