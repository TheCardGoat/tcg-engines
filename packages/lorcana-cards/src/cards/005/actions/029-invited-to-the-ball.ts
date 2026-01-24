import type { ActionCard } from "@tcg/lorcana-types";

export const invitedToTheBall: ActionCard = {
  id: "5ai",
  cardType: "action",
  name: "Invited to the Ball",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "005",
  text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 2,
  cardNumber: 29,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "131285f868d7a8dcc13be15bf7ce5a95fa706fa1",
  },
  abilities: [
    {
      id: "5ai-1",
      type: "action",
      effect: {
        type: "put-on-bottom",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
};
