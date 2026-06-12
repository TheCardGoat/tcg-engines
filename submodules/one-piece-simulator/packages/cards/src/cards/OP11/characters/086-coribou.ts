import type { CharacterCard } from "@tcg/op-types";
import { op11Coribou086I18n } from "./086-coribou.i18n.ts";

export const op11Coribou086: CharacterCard = {
  id: "OP11-086",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Caribou Pirates"],
  attribute: "strike",
  effect:
    "[On Play] Trash 1 card from your hand.\n[Activate: Main] You may trash this Character: Play up to 1 [Caribou] with a cost of 4 or less from your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "name",
                value: "Caribou",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Coribou086I18n,
};
