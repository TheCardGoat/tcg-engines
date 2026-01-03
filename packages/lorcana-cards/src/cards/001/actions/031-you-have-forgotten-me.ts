import type { ActionCard } from "@tcg/lorcana-types";

export const YouHaveForgottenMe: ActionCard = {
  id: "1cn",
  cardType: "action",
  name: "You Have Forgotten Me",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  text: "Each opponent chooses and discards 2 cards.",
  cost: 4,
  cardNumber: 31,
  inkable: true,
  externalIds: {
    ravensburger: "af649d5bbf464478b0095af6a2bebd4bf32e467d",
  },
  abilities: [
    {
      id: "1cn-1",
      text: "Each opponent chooses and discards 2 cards.",
      type: "action",
      effect: {
        type: "discard",
        amount: 2,
        target: "EACH_OPPONENT",
        chosen: true,
      },
    },
  ],
};
