import type { ActionCard } from "@tcg/lorcana-types";

export const youCanFly: ActionCard = {
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
      id: "ojo-1",
      text: "Chosen character gains Evasive until the start of your next turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 131,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "58776f4069675bc00ffc50d5d4cc8aaf7b95b0fc",
  },
  franchise: "Peter Pan",
  id: "ojo",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "You Can Fly!",
  set: "009",
  text: "Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
};
