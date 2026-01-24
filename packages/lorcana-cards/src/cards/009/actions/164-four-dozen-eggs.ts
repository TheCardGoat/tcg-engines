import type { ActionCard } from "@tcg/lorcana-types";

export const fourDozenEggs: ActionCard = {
  id: "1np",
  cardType: "action",
  name: "Four Dozen Eggs",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "Your characters gain Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 164,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d52697d4b0ff2e40219b0dd851caf0ee7dc5cf09",
  },
  abilities: [
    {
      id: "1np-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 2,
      },
      text: "Your characters gain Resist +2 until the start of your next turn.",
    },
  ],
};
