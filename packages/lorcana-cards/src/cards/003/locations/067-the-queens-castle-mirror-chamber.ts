import type { LocationCard } from "@tcg/lorcana-types";

export const theQueensCastleMirrorChamber: LocationCard = {
  abilities: [
    {
      effect: {
        counter: {
          type: "characters",
          controller: "you",
        },
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "for-each",
      },
      id: "16x-1",
      text: "USING THE MIRROR At the start of your turn, for each character you have here, you may draw a card.",
      type: "action",
    },
  ],
  cardNumber: 67,
  cardType: "location",
  cost: 4,
  externalIds: {
    ravensburger: "9ab00d3ccf3aa6a5a6653a6a70340dd4cfdf1666",
  },
  franchise: "Snow White",
  fullName: "The Queen's Castle - Mirror Chamber",
  id: "16x",
  inkType: ["amethyst"],
  inkable: true,
  lore: 0,
  moveCost: 1,
  name: "The Queen's Castle",
  set: "003",
  text: "USING THE MIRROR At the start of your turn, for each character you have here, you may draw a card.",
  version: "Mirror Chamber",
};
