import type { ActionCard } from "@tcg/lorcana-types";

export const BeOurGuest: ActionCard = {
  id: "m6n",
  cardType: "action",
  name: "Be Our Guest",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing this\rsong for free.)_\nLook at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 2,
  actionSubtype: "song",
  cardNumber: 25,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "_(A character with cost 2 or more can {E} to sing this\rsong for free.)_\nLook at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      id: "m6n-1",
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};
