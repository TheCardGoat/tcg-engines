import type { ItemCard } from "@tcg/lorcana-types";

export const megabot: ItemCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      id: "137-1",
      name: "HAPPY FACE",
      text: "HAPPY FACE This item enters play exerted.",
      type: "static",
    },
  ],
  cardNumber: 98,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "8d39122e87e1603287c1b7a7ea6692a829361d9d",
  },
  franchise: "Big Hero 6",
  id: "137",
  inkType: ["emerald"],
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  name: "MegaBot",
  set: "006",
  text: "HAPPY FACE This item enters play exerted.\nDESTROY! {E}, Banish this item - Choose one:\n* Banish chosen item.\n* Banish chosen damaged character.",
};
