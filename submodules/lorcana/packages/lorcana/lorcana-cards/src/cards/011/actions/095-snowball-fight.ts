import type { ActionCard } from "@tcg/lorcana-types";
import { snowballFightI18n } from "./095-snowball-fight.i18n";

export const snowballFight: ActionCard = {
  id: "ucF",
  canonicalId: "ci_ucF",
  reprints: ["set11-095"],
  cardType: "action",
  name: "Snowball Fight",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 95,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8bd23953f8744c588a3f122476f67c3c",
    tcgPlayer: 673071,
  },
  text: "Each opponent chooses and discards a card. If you have a character with Evasive in play, gain 1 lore.",
  abilities: [
    {
      type: "action",
      text: "Each opponent chooses and discards a card. If you have a character with Evasive in play, gain 1 lore.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "discard",
            amount: 1,
            chosen: true,
            from: "hand",
            target: "EACH_OPPONENT",
          },
          {
            type: "conditional",
            condition: {
              type: "target-query",
              query: {
                selector: "all",
                owner: "you",
                zones: ["play"],
                cardType: "character",
                filters: [
                  {
                    type: "has-keyword",
                    keyword: "Evasive",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            then: {
              type: "gain-lore",
              amount: 1,
              target: "CONTROLLER",
            },
          },
        ],
      },
    },
  ],
  i18n: snowballFightI18n,
};
