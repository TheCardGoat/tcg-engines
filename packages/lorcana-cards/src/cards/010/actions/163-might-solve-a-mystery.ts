import type { ActionCard } from "@tcg/lorcana-types";

export const mightSolveAMystery: ActionCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "16a-1",
      text: "Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 163,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "97e957a0218674c1311025733096078b5b727f1a",
  },
  franchise: "Ducktales",
  id: "16a",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Might Solve a Mystery",
  set: "010",
  text: "Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.",
};
