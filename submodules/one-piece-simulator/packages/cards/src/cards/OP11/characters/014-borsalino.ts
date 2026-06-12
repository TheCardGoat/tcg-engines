import type { CharacterCard } from "@tcg/op-types";
import { op11Borsalino014I18n } from "./014-borsalino.i18n.ts";

export const op11Borsalino014: CharacterCard = {
  id: "OP11-014",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP11",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["FILM Navy"],
  attribute: "special",
  effect:
    '[Blocker]\n[Activate: Main] You may rest this Character: Up to 1 of your "Navy" type Leader or Character cards can also attack active Characters during this turn.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Navy",
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Borsalino014I18n,
};
