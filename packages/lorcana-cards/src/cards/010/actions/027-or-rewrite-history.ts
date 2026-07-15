import type { ActionCard } from "@tcg/lorcana-types";

export const orRewriteHistory: ActionCard = {
  abilities: [
    {
      effect: {
        cardType: "character",
        target: "CONTROLLER",
        type: "return-from-discard",
      },
      id: "400-1",
      text: "Return a character card from your discard to your hand.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 27,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "0e6aabe440055238206922c66bdad3dcbe1453e5",
  },
  franchise: "Ducktales",
  id: "400",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Or Rewrite History!",
  set: "010",
  text: "Return a character card from your discard to your hand.",
};
