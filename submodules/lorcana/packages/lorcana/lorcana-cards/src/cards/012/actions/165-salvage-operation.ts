import type { ActionCard } from "@tcg/lorcana-types";
import { salvageOperationI18n } from "./165-salvage-operation.i18n";

export const salvageOperation: ActionCard = {
  id: "SfW",
  canonicalId: "ci_SfW",
  reprints: ["set12-165"],
  cardType: "action",
  name: "Salvage Operation",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 165,
  rarity: "uncommon",
  cost: 2,
  inkable: true,

  externalIds: {
    lorcast: "crd_63707e5a57c94a458792bd9ae218a839",
  },
  text: "Return an item card from your discard to your hand. If you have a character with 4 {W} or more in play, gain 1 lore.",
  abilities: [
    {
      type: "action",
      text: "Return an item card from your discard to your hand. If you have a character with 4 {W} or more in play, gain 1 lore.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["discard"],
              cardTypes: ["item"],
            },
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
                    type: "willpower-comparison",
                    comparison: "greater-or-equal",
                    value: 4,
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
  i18n: salvageOperationI18n,
};
