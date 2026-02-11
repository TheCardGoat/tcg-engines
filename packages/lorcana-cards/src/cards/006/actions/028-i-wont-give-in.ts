import type { ActionCard } from "@tcg/lorcana-types";

export const iWontGiveIn: ActionCard = {
  abilities: [
    {
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
      id: "v73-1",
      text: "Return a character card with cost 2 or less from your discard to your hand.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 28,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "706fa1412f17c17eec43c565c3816da3af922fe6",
  },
  franchise: "Zootropolis",
  id: "v73",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "I Won't Give In",
  set: "006",
  text: "Return a character card with cost 2 or less from your discard to your hand.",
};
