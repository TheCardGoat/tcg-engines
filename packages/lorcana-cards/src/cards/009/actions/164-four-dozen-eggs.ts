import type { ActionCard } from "@tcg/lorcana-types";

export const fourDozenEggs: ActionCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 2,
      },
      id: "1np-1",
      text: "Your characters gain Resist +2 until the start of your next turn.",
      type: "static",
    },
  ],
  actionSubtype: "song",
  cardNumber: 164,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "d52697d4b0ff2e40219b0dd851caf0ee7dc5cf09",
  },
  franchise: "Beauty and the Beast",
  id: "1np",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Four Dozen Eggs",
  set: "009",
  text: "Your characters gain Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
};
