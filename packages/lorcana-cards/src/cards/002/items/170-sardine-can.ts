import type { ItemCard } from "@tcg/lorcana-types";

export const sardineCan: ItemCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      id: "2oi-1",
      name: "FLIGHT CABIN Your exerted",
      text: "FLIGHT CABIN Your exerted characters gain Ward.",
      type: "static",
    },
  ],
  cardNumber: 170,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "09a95b1575fe35eec08ad5e0dce576e221bcff9d",
  },
  franchise: "Rescuers",
  id: "2oi",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Sardine Can",
  set: "002",
  text: "FLIGHT CABIN Your exerted characters gain Ward. (Opponents can't choose them except to challenge.)",
};
