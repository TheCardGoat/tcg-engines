import type { ItemCard } from "@tcg/lorcana-types";

export const emeraldCoil: ItemCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
      },
      id: "1xj-1",
      name: "SHIMMERING WINGS",
      text: "SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 120,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "f9a952d88bbccdde151f68df4d1cfc77395426cf",
  },
  franchise: "Lorcana",
  id: "1xj",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Emerald Coil",
  set: "007",
  text: "SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
};
