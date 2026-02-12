import type { ItemCard } from "@tcg/lorcana-types";

export const greatStoneDragon: ItemCard = {
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "19h-1",
      name: "ASLEEP",
      text: "ASLEEP This item enters play exerted.",
      type: "static",
    },
    {
      cost: { exert: true },
      effect: {
        exerted: true,
        facedown: true,
        source: "discard",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "19h-2",
      text: "AWAKEN {E} — Put a character card from your discard into your inkwell facedown and exerted.",
      type: "activated",
    },
  ],
  cardNumber: 167,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "a483198432a5bd7a7c3564e2fe584d5c13f05727",
  },
  franchise: "Mulan",
  id: "19h",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Great Stone Dragon",
  set: "004",
  text: "ASLEEP This item enters play exerted.\nAWAKEN {E} — Put a character card from your discard into your inkwell facedown and exerted.",
};
