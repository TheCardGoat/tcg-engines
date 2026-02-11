import type { ActionCard } from "@tcg/lorcana-types";

export const downInNewOrleans: ActionCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "nqg-1",
      text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 177,
  cardType: "action",
  cost: 6,
  externalIds: {
    ravensburger: "558b2925c1c3f90d5f91bd793063de0531921f04",
  },
  franchise: "Princess and the Frog",
  id: "nqg",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Down in New Orleans",
  set: "008",
  text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
};
