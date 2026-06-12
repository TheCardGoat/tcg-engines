import type { CharacterCard } from "@tcg/op-types";
import { op12Sakazuki044I18n } from "./044-sakazuki.i18n.ts";

export const op12Sakazuki044: CharacterCard = {
  id: "OP12-044",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP12",
  cost: 7,
  power: 8000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    '[On Play] If your Leader has the "Navy" type, draw 2 cards.\n[Activate: Main] [Once Per Turn] You may trash 1 card from your hand: Give up to 1 rested DON!! card to your Leader or 1 of your Characters.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12Sakazuki044I18n,
};
