import type { ActionCard } from "@tcg/lorcana-types";

export const lookAtThisFamily: ActionCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "put-on-bottom",
        },
        type: "optional",
      },
      id: "lj6-1",
      text: "Sing Together 7 Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 25,
  cardType: "action",
  cost: 7,
  externalIds: {
    ravensburger: "4d9b353aa7f368d78fa825e4fdce71da6b544363",
  },
  franchise: "Encanto",
  id: "lj6",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Look at This Family",
  set: "009",
  text: "Sing Together 7 Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
};
