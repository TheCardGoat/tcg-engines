import type { LocationCard } from "@tcg/lorcana-types";

export const theBitterwoodUndergroundForest: LocationCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "g5d-1",
      name: "GATHER RESOURCES Once",
      text: "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 135,
  cardType: "location",
  cost: 4,
  externalIds: {
    ravensburger: "3a3459cd9d25b260d30643f438ea1fc29b17f5b4",
  },
  franchise: "Lorcana",
  fullName: "The Bitterwood - Underground Forest",
  id: "g5d",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "The Bitterwood",
  set: "010",
  text: "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
  version: "Underground Forest",
};
