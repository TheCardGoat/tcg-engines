import type { ActionCard } from "@tcg/lorcana-types";

export const soMuchToGive: ActionCard = {
  id: "jyr",
  cardType: "action",
  name: "So Much to Give",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "007",
  text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 38,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "47f551a402c331ac81e1b4f502c282a9cdb4dc34",
  },
  abilities: [
    {
      id: "jyr-1",
      type: "action",
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
      text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn.",
    },
  ],
};
