import type { ActionCard } from "@tcg/lorcana-types";
import { chargeI18n } from "./198-charge.i18n";

export const charge: ActionCard = {
  id: "FWM",
  canonicalId: "ci_FWM",
  reprints: ["set2-198"],
  cardType: "action",
  name: "Charge!",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 198,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7f7875c57b0f49d9a0ca569ec1037777",
    tcgPlayer: 527639,
  },
  text: "Chosen character gains Challenger +2 and Resist +2 this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
            value: 2,
          },
          {
            duration: "this-turn",
            keyword: "Resist",
            target: {
              ref: "previous-target",
            },
            type: "gain-keyword",
            value: 2,
          },
        ],
      },
    },
  ],
  i18n: chargeI18n,
};
