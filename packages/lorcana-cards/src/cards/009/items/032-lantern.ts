import type { ItemCard } from "@tcg/lorcana-types";

export const lantern: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "o5u-1",
      text: "BIRTHDAY LIGHTS {E} — You pay 1 {I} less for the next character you play this turn.",
      type: "activated",
    },
  ],
  cardNumber: 32,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "571543865d85c8113b9baffbbb8680a892462cbe",
  },
  franchise: "Tangled",
  id: "o5u",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Lantern",
  set: "009",
  text: "BIRTHDAY LIGHTS {E} — You pay 1 {I} less for the next character you play this turn.",
};
