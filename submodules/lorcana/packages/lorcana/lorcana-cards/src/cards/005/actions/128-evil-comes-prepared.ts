import type { ActionCard } from "@tcg/lorcana-types";
import { evilComesPreparedI18n } from "./128-evil-comes-prepared.i18n";

export const evilComesPrepared: ActionCard = {
  id: "Vin",
  canonicalId: "ci_Yvo",
  reprints: ["set5-128"],
  cardType: "action",
  name: "Evil Comes Prepared",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 128,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_07fed6332fd14403b062bc4f1aed3e63",
    tcgPlayer: 561964,
  },
  text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "ready",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              ref: "previous-target",
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
                    classification: "Villain",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            then: {
              amount: 1,
              target: "CONTROLLER",
              type: "gain-lore",
            },
          },
        ],
        type: "sequence",
      },
      id: "1qd-1",
      text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
      type: "action",
    },
  ],
  i18n: evilComesPreparedI18n,
};
