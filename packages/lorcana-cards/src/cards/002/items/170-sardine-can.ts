import type { ItemCard } from "@tcg/lorcana-types";

export const sardineCan: ItemCard = {
  id: "2oi",
  cardType: "item",
  name: "Sardine Can",
  inkType: ["sapphire"],
  franchise: "Rescuers",
  set: "002",
  text: "FLIGHT CABIN Your exerted characters gain Ward. (Opponents can't choose them except to challenge.)",
  cost: 4,
  cardNumber: 170,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "09a95b1575fe35eec08ad5e0dce576e221bcff9d",
  },
  abilities: [
    {
      id: "2oi-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      name: "FLIGHT CABIN Your exerted",
      text: "FLIGHT CABIN Your exerted characters gain Ward.",
    },
  ],
};
