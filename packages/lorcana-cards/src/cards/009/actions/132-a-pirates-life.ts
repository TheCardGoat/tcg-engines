import type { ActionCard } from "@tcg/lorcana-types";

export const aPiratesLife: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "lose-lore",
            amount: 2,
            target: "EACH_OPPONENT",
          },
          {
            type: "gain-lore",
            amount: 2,
          },
        ],
        type: "sequence",
      },
      id: "w74-1",
      text: "Sing Together 6 Each opponent loses 2 lore. You gain 2 lore.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 132,
  cardType: "action",
  cost: 6,
  externalIds: {
    ravensburger: "740b1d11aff60c73e623704984ea2d1ed98a312f",
  },
  franchise: "Peter Pan",
  id: "w74",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "A Pirate’s Life",
  set: "009",
  text: "Sing Together 6 Each opponent loses 2 lore. You gain 2 lore.",
};
