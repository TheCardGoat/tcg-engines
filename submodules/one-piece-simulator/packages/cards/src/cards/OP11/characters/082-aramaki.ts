import type { CharacterCard } from "@tcg/op-types";
import { op11Aramaki082I18n } from "./082-aramaki.i18n.ts";

export const op11Aramaki082: CharacterCard = {
  id: "OP11-082",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    '[Activate: Main] You may trash this Character: If your Leader has the "Navy" type, up to 1 of your "Navy" type Characters can also attack active Characters during this turn. Then, trash 2 cards from the top of your deck.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
          },
        ],
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["character"],
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
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Aramaki082I18n,
};
