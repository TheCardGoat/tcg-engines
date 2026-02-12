import type { ActionCard } from "@tcg/lorcana-types";

export const nextStopOlympus: ActionCard = {
  abilities: [
    {
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
      id: "xl2-1",
      text: "ACTION If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.",
      type: "action",
    },
    {
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
      id: "xl2-2",
      text: "Ready chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 129,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "790b03a85acbeacfa6e0cdce19e8aa611d38f18b",
  },
  franchise: "Hercules",
  id: "xl2",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Next Stop, Olympus",
  set: "010",
  text: "ACTION If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.\nReady chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
};
