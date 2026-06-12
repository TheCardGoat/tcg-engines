import type { ActionCard } from "@tcg/lorcana-types";
import { viciousBetrayalI18n } from "./100-vicious-betrayal.i18n";

export const viciousBetrayal: ActionCard = {
  id: "sYQ",
  canonicalId: "ci_sYQ",
  reprints: ["set1-100"],
  cardType: "action",
  name: "Vicious Betrayal",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 100,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_85e0edbb8cbd458fa3957029a8bb5697",
    tcgPlayer: 506150,
  },
  text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            duration: "this-turn",
            modifier: 2,
            stat: "strength",
            target: "CHOSEN_CHARACTER",
            type: "modify-stat",
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
              duration: "this-turn",
              modifier: 1,
              stat: "strength",
              target: {
                ref: "previous-target",
              },
              type: "modify-stat",
            },
          },
        ],
      },
    },
  ],
  i18n: viciousBetrayalI18n,
};
