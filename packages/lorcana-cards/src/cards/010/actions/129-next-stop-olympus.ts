import type { ActionCard } from "@tcg/lorcana-types";

export const nextStopOlympus: ActionCard = {
  id: "xl2",
  cardType: "action",
  name: "Next Stop, Olympus",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  text: "ACTION If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.\nReady chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
  cost: 2,
  cardNumber: 129,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "790b03a85acbeacfa6e0cdce19e8aa611d38f18b",
  },
  abilities: [
    {
      id: "xl2-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character with 5 {S} or more in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "ACTION If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.",
    },
    {
      id: "xl2-2",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      text: "Ready chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
    },
  ],
};
