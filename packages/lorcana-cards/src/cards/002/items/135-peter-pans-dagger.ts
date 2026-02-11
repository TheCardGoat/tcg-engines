import type { ItemCard } from "@tcg/lorcana-types";

export const peterPansDagger: ItemCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      id: "hwz-1",
      text: "Your characters with Evasive get +1 {S}.",
      type: "static",
    },
  ],
  cardNumber: 135,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "40927c4f37a9c377366de9cff761fa64f0580f95",
  },
  franchise: "Peter Pan",
  id: "hwz",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "Peter Pan's Dagger",
  set: "002",
  text: "Your characters with Evasive get +1 {S}.",
};
