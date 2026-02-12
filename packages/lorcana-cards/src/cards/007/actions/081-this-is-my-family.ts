import type { ActionCard } from "@tcg/lorcana-types";

export const thisIsMyFamily: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "gain-lore",
            amount: 1,
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
        type: "sequence",
      },
      id: "1io-1",
      text: "Gain 1 lore. Draw a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 81,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "c3565f192febee8aaadc4da67348a3246ad959eb",
  },
  franchise: "Encanto",
  id: "1io",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "This Is My Family",
  set: "007",
  text: "Gain 1 lore. Draw a card.",
};
