import type { ActionCard } from "@tcg/lorcana-types";
import { nextStopOlympusI18n } from "./129-next-stop-olympus.i18n";

export const nextStopOlympus: ActionCard = {
  id: "DMG",
  canonicalId: "ci_49R",
  reprints: ["set10-129"],
  cardType: "action",
  name: "Next Stop, Olympus",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 129,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fe0bc499ead74e4f8a5d2b0e6037cf91",
    tcgPlayer: 660028,
  },
  text: [
    {
      title: "ACTION",
      description:
        "If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.",
    },
    {
      title:
        "Ready chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
    },
  ],
  abilities: [
    {
      type: "static",
      name: "ACTION",
      text: "ACTION If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.",
      sourceZones: ["hand"],
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 5,
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "cost-reduction",
        amount: 2,
      },
    },
    {
      name: "ACTION",
      text: "Ready chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
      type: "action",
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              ref: "previous-target",
            },
            type: "restriction",
          },
          {
            ability: "gain-lore-when-challenging",
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
            type: "grant-ability",
          },
        ],
        type: "sequence",
      },
    },
  ],
  i18n: nextStopOlympusI18n,
};
