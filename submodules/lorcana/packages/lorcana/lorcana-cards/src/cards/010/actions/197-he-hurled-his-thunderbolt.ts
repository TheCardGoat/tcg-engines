import type { ActionCard } from "@tcg/lorcana-types";
import { heHurledHisThunderboltI18n } from "./197-he-hurled-his-thunderbolt.i18n";

export const heHurledHisThunderbolt: ActionCard = {
  id: "3ft",
  canonicalId: "ci_2tJ",
  reprints: ["set10-197"],
  cardType: "action",
  name: "He Hurled His Thunderbolt",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 197,
  rarity: "uncommon",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_de5dfda85c534def9ee3a0d93cb55597",
    tcgPlayer: 660026,
  },
  text: "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 4,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "deal-damage",
          },
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-classification",
                  classification: "Deity",
                },
              ],
            },
            type: "gain-keyword",
            value: 2,
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: heHurledHisThunderboltI18n,
};
