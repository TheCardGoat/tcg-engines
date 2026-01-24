import type { ItemCard } from "@tcg/lorcana-types";

export const cleansingRainwater: ItemCard = {
  id: "w7f",
  cardType: "item",
  name: "Cleansing Rainwater",
  inkType: ["amber"],
  franchise: "Raya and the Last Dragon",
  set: "003",
  text: "ANCIENT POWER Banish this item — Remove up to 2 damage from each of your characters.",
  cost: 2,
  cardNumber: 29,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "741296e5c7fe289b3e57d105fe603434b8320ffa",
  },
  abilities: [
    {
      id: "w7f-1",
      type: "activated",
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "ANCIENT POWER Banish this item — Remove up to 2 damage from each of your characters.",
    },
  ],
};
