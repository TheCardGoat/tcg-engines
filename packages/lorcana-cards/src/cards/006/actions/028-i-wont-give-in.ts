import type { ActionCard } from "@tcg/lorcana-types";

export const iWontGiveIn: ActionCard = {
  id: "v73",
  cardType: "action",
  name: "I Won't Give In",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  text: "Return a character card with cost 2 or less from your discard to your hand.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 28,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "706fa1412f17c17eec43c565c3816da3af922fe6",
  },
  abilities: [
    {
      id: "v73-1",
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Return a character card with cost 2 or less from your discard to your hand.",
    },
  ],
};
