import type { ActionCard } from "@tcg/lorcana-types";

export const twitterpated: ActionCard = {
  id: "11m",
  cardType: "action",
  name: "Twitterpated",
  inkType: ["ruby"],
  franchise: "Bambi",
  set: "008",
  text: "Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 1,
  cardNumber: 150,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8796f4cb21d5e4fb185646eae3e02d2b25ce1fc6",
  },
  abilities: [
    {
      id: "11m-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Chosen character gains Evasive until the start of your next turn.",
    },
  ],
};
