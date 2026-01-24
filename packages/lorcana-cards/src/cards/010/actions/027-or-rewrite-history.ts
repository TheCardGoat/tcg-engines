import type { ActionCard } from "@tcg/lorcana-types";

export const orRewriteHistory: ActionCard = {
  id: "400",
  cardType: "action",
  name: "Or Rewrite History!",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "Return a character card from your discard to your hand.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 27,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0e6aabe440055238206922c66bdad3dcbe1453e5",
  },
  abilities: [
    {
      id: "400-1",
      type: "action",
      effect: {
        type: "return-from-discard",
        target: "CONTROLLER",
        cardType: "character",
      },
      text: "Return a character card from your discard to your hand.",
    },
  ],
};
