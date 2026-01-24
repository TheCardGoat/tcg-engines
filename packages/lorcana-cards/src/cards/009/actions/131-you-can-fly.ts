import type { ActionCard } from "@tcg/lorcana-types";

export const youCanFly: ActionCard = {
  id: "ojo",
  cardType: "action",
  name: "You Can Fly!",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "009",
  text: "Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 131,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "58776f4069675bc00ffc50d5d4cc8aaf7b95b0fc",
  },
  abilities: [
    {
      id: "ojo-1",
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
