import type { ActionCard } from "@tcg/lorcana-types";

export const hypnotize: ActionCard = {
  id: "1kn",
  cardType: "action",
  name: "Hypnotize",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "002",
  text: "Each opponent chooses and discards a card. Draw a card.",
  cost: 3,
  cardNumber: 98,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cbba562b84a9e94b1f0e30aceba74976a88608a3",
  },
  abilities: [
    {
      id: "1kn-1",
      type: "action",
      effect: {
        type: "sequence",
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
      },
      text: "Each opponent chooses and discards a card. Draw a card.",
    },
  ],
};
