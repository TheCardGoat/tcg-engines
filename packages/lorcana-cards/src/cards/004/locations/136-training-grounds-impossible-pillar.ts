import type { LocationCard } from "@tcg/lorcana-types";

export const trainingGroundsImpossiblePillar: LocationCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "etf-1",
      text: "STRENGTH OF MIND 1 {I} — Chosen character here gets +1 {S} this turn.",
      type: "activated",
    },
  ],
  cardNumber: 136,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "35674539959c7627310558941f91d1dac8adff48",
  },
  franchise: "Mulan",
  fullName: "Training Grounds - Impossible Pillar",
  id: "etf",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Training Grounds",
  set: "004",
  text: "STRENGTH OF MIND 1 {I} — Chosen character here gets +1 {S} this turn.",
  version: "Impossible Pillar",
};
