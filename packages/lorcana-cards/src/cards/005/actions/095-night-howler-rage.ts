import type { ActionCard } from "@tcg/lorcana-types";

export const nightHowlerRage: ActionCard = {
  id: "1mw",
  cardType: "action",
  name: "Night Howler Rage",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "005",
  text: "Draw a card. Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  cardNumber: 95,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d25d7ef8b4fe1c826e2faa544124363358944a73",
  },
  abilities: [
    {
      id: "1mw-1",
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
            keyword: "Reckless",
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
      text: "Draw a card. Chosen character gains Reckless during their next turn.",
    },
  ],
};
