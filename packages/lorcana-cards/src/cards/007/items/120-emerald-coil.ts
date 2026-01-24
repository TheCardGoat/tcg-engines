import type { ItemCard } from "@tcg/lorcana-types";

export const emeraldCoil: ItemCard = {
  id: "1xj",
  cardType: "item",
  name: "Emerald Coil",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "007",
  text: "SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 3,
  cardNumber: 120,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f9a952d88bbccdde151f68df4d1cfc77395426cf",
  },
  abilities: [
    {
      id: "1xj-1",
      type: "triggered",
      name: "SHIMMERING WINGS",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn.",
    },
  ],
};
