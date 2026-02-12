import type { ActionCard } from "@tcg/lorcana-types";

export const nightHowlerRage: ActionCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "1mw-1",
      text: "Draw a card. Chosen character gains Reckless during their next turn.",
      type: "action",
    },
  ],
  cardNumber: 95,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "d25d7ef8b4fe1c826e2faa544124363358944a73",
  },
  franchise: "Zootropolis",
  id: "1mw",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Night Howler Rage",
  set: "005",
  text: "Draw a card. Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
};
