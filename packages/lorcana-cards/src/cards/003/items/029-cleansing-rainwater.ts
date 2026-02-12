import type { ItemCard } from "@tcg/lorcana-types";

export const cleansingRainwater: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "w7f-1",
      text: "ANCIENT POWER Banish this item — Remove up to 2 damage from each of your characters.",
      type: "activated",
    },
  ],
  cardNumber: 29,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "741296e5c7fe289b3e57d105fe603434b8320ffa",
  },
  franchise: "Raya and the Last Dragon",
  id: "w7f",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Cleansing Rainwater",
  set: "003",
  text: "ANCIENT POWER Banish this item — Remove up to 2 damage from each of your characters.",
};
