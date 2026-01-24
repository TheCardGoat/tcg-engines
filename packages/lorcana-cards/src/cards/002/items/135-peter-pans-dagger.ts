import type { ItemCard } from "@tcg/lorcana-types";

export const peterPansDagger: ItemCard = {
  id: "hwz",
  cardType: "item",
  name: "Peter Pan's Dagger",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "002",
  text: "Your characters with Evasive get +1 {S}.",
  cost: 2,
  cardNumber: 135,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "40927c4f37a9c377366de9cff761fa64f0580f95",
  },
  abilities: [
    {
      id: "hwz-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      text: "Your characters with Evasive get +1 {S}.",
    },
  ],
};
