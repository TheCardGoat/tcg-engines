import type { ActionCard } from "@tcg/lorcana-types";

export const lookAtThisFamily: ActionCard = {
  id: "lj6",
  cardType: "action",
  name: "Look at This Family",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "009",
  text: "Sing Together 7 Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  cost: 7,
  cardNumber: 25,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4d9b353aa7f368d78fa825e4fdce71da6b544363",
  },
  abilities: [
    {
      id: "lj6-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "Sing Together 7 Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
};
