import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeYonji066I18n } from "./066-vinsmoke-yonji.i18n.ts";

export const op06VinsmokeYonji066: CharacterCard = {
  id: "OP06-066",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "strike",
  effect:
    "[Activate:Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.)You may trash this Character: If your Leader has the [GERMA 66] type, play up to 1 [Vinsmoke Yonji] with a cost of 4 from your hand or trash.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "GERMA 66",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 4,
              },
              {
                filter: "name",
                value: "Vinsmoke Yonji",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06VinsmokeYonji066I18n,
};
