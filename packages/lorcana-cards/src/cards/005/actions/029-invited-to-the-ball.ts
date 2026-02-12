import type { ActionCard } from "@tcg/lorcana-types";

export const invitedToTheBall: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "put-on-bottom",
      },
      id: "5ai-1",
      text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  cardNumber: 29,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "131285f868d7a8dcc13be15bf7ce5a95fa706fa1",
  },
  franchise: "Cinderella",
  id: "5ai",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Invited to the Ball",
  set: "005",
  text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
};
