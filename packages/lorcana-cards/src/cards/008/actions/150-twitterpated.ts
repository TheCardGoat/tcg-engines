import type { ActionCard } from "@tcg/lorcana-types";

export const twitterpated: ActionCard = {
  abilities: [
    {
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
      id: "11m-1",
      text: "Chosen character gains Evasive until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 150,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "8796f4cb21d5e4fb185646eae3e02d2b25ce1fc6",
  },
  franchise: "Bambi",
  id: "11m",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Twitterpated",
  set: "008",
  text: "Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
};
