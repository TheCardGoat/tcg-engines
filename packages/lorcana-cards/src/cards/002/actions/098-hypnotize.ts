import type { ActionCard } from "@tcg/lorcana-types";

export const hypnotize: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "discard",
            amount: 1,
            target: "EACH_OPPONENT",
            chosen: true,
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
        type: "sequence",
      },
      id: "1kn-1",
      text: "Each opponent chooses and discards a card. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 98,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "cbba562b84a9e94b1f0e30aceba74976a88608a3",
  },
  franchise: "Jungle Book",
  id: "1kn",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Hypnotize",
  set: "002",
  text: "Each opponent chooses and discards a card. Draw a card.",
};
