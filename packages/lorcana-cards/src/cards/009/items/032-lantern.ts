import type { ItemCard } from "@tcg/lorcana-types";

export const lantern: ItemCard = {
  id: "o5u",
  cardType: "item",
  name: "Lantern",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "009",
  text: "BIRTHDAY LIGHTS {E} — You pay 1 {I} less for the next character you play this turn.",
  cost: 2,
  cardNumber: 32,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "571543865d85c8113b9baffbbb8680a892462cbe",
  },
  abilities: [
    {
      id: "o5u-1",
      type: "activated",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "BIRTHDAY LIGHTS {E} — You pay 1 {I} less for the next character you play this turn.",
    },
  ],
};
