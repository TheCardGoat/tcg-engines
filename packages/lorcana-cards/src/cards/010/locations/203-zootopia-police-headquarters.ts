import type { LocationCard } from "@tcg/lorcana-types";

export const zootopiaPoliceHeadquarters: LocationCard = {
  id: "98y",
  cardType: "location",
  name: "Zootopia",
  version: "Police Headquarters",
  fullName: "Zootopia - Police Headquarters",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 203,
  inkable: true,
  externalIds: {
    ravensburger: "2155a20775327ef31c200c31abc6084494a2cc46",
  },
  abilities: [
    {
      id: "98y-1",
      text: "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.",
      name: "NEW INFORMATION",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};
