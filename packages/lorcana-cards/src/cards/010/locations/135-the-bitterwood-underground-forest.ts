import type { LocationCard } from "@tcg/lorcana-types";

export const theBitterwoodUndergroundForest: LocationCard = {
  id: "g5d",
  cardType: "location",
  name: "The Bitterwood",
  version: "Underground Forest",
  fullName: "The Bitterwood - Underground Forest",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "010",
  text: "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
  cost: 4,
  moveCost: 2,
  lore: 0,
  cardNumber: 135,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a3459cd9d25b260d30643f438ea1fc29b17f5b4",
  },
  abilities: [
    {
      id: "g5d-1",
      type: "triggered",
      name: "GATHER RESOURCES Once",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
    },
  ],
};
