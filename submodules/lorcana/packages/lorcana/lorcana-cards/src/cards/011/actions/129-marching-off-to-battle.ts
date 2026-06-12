import type { ActionCard } from "@tcg/lorcana-types";
import { marchingOffToBattleI18n } from "./129-marching-off-to-battle.i18n";

export const marchingOffToBattle: ActionCard = {
  id: "P9W",
  canonicalId: "ci_P9W",
  reprints: ["set11-129"],
  cardType: "action",
  name: "Marching Off to Battle",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 129,
  rarity: "common",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_ec2f9a5da94841b68ac5f69bfed3c1bd",
    tcgPlayer: 675506,
  },
  text: "If a character was banished this turn, draw 2 cards.",
  actionSubtype: "song",
  abilities: [
    {
      id: "yrv-1",
      effect: {
        type: "conditional",
        condition: {
          type: "turn-metric",
          metric: "banished-characters",
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
        effect: {
          amount: 2,
          target: "CONTROLLER",
          type: "draw",
        },
      },
      type: "action",
      text: "If a character was banished this turn, draw 2 cards.",
    },
  ],
  i18n: marchingOffToBattleI18n,
};
