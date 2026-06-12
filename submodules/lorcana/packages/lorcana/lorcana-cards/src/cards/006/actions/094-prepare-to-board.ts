import type { ActionCard } from "@tcg/lorcana-types";
import { prepareToBoardI18n } from "./094-prepare-to-board.i18n";

export const prepareToBoard: ActionCard = {
  id: "ZLw",
  canonicalId: "ci_ZLw",
  reprints: ["set6-094"],
  cardType: "action",
  name: "Prepare to Board!",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 94,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7ce20e98d86e43eaaf8c525c60f4086c",
    tcgPlayer: 587968,
  },
  text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            modifier: 2,
            duration: "this-turn",
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
                    classification: "Pirate",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            then: {
              modifier: 1,
              duration: "this-turn",
              stat: "strength",
              target: {
                ref: "previous-target",
              },
              type: "modify-stat",
            },
          },
        ],
      },
      id: "lql-1",
      text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
      type: "action",
    },
  ],
  i18n: prepareToBoardI18n,
};
