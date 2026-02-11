import type { ActionCard } from "@tcg/lorcana-types";

export const soMuchToGive: ActionCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-keyword",
            keyword: "Bodyguard",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
      id: "jyr-1",
      text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 38,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "47f551a402c331ac81e1b4f502c282a9cdb4dc34",
  },
  franchise: "Bolt",
  id: "jyr",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "So Much to Give",
  set: "007",
  text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
};
