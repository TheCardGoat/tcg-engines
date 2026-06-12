import type { ActionCard } from "@tcg/lorcana-types";
import { ambushI18n } from "./198-ambush.i18n";

export const ambush: ActionCard = {
  id: "UOR",
  canonicalId: "ci_UOR",
  reprints: ["set6-198"],
  cardType: "action",
  name: "Ambush!",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 198,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_35df29e6893942a38a14f775719ce522",
    tcgPlayer: 587971,
  },
  text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
  abilities: [
    {
      type: "action",
      text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "ready",
                },
              ],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "deal-damage",
              amount: {
                type: "strength-of",
                target: {
                  ref: "previous-target",
                },
              },
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        ],
      },
    },
  ],
  i18n: ambushI18n,
};
