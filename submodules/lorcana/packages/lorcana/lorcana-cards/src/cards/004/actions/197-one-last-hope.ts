import type { ActionCard } from "@tcg/lorcana-types";
import { oneLastHopeI18n } from "./197-one-last-hope.i18n";

export const oneLastHope: ActionCard = {
  id: "hKo",
  canonicalId: "ci_qmz",
  reprints: ["set4-197", "set9-197"],
  cardType: "action",
  name: "One Last Hope",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 197,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_ae1714b13cbc42a4a83ec36fee365526",
    tcgPlayer: 650157,
  },
  text: "Chosen character gains Resist +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            duration: "until-start-of-next-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "target-query",
              query: {
                selector: "all",
                reference: "selected-first",
                filters: [
                  {
                    type: "card-type",
                    value: "character",
                  },
                  {
                    type: "has-classification",
                    classification: "Hero",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            then: {
              type: "grant-ability",
              ability: "can-challenge-ready",
              duration: "this-turn",
              target: {
                ref: "previous-target",
              },
            },
          },
        ],
      },
    },
  ],
  i18n: oneLastHopeI18n,
};
