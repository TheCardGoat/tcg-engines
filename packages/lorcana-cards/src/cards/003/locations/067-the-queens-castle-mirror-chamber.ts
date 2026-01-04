import type { LocationCard } from "@tcg/lorcana-types";

export const theQueensCastleMirrorChamber: LocationCard = {
  id: "16x",
  cardType: "location",
  name: "The Queen's Castle",
  version: "Mirror Chamber",
  fullName: "The Queen's Castle - Mirror Chamber",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "003",
  text: "USING THE MIRROR At the start of your turn, for each character you have here, you may draw a card.",
  cost: 4,
  moveCost: 1,
  lore: 0,
  cardNumber: 67,
  inkable: true,
  externalIds: {
    ravensburger: "9ab00d3ccf3aa6a5a6653a6a70340dd4cfdf1666",
  },
  abilities: [
    {
      id: "16x-1",
      type: "action",
      effect: {
        type: "for-each",
        counter: {
          type: "characters",
          controller: "you",
        },
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
};
