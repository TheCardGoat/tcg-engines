import type { CharacterCard } from "@tcg/op-types";
import { op04Leo091I18n } from "./091-leo.i18n.ts";

export const op04Leo091: CharacterCard = {
  id: "OP04-091",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Dressrosa The Tontattas"],
  attribute: "strike",
  effect:
    "[On Play] You may rest your 1 Leader: If your Leader has the [Dressrosa] type, K.O. up to 1 of your opponent's Characters with a cost of 1 or less. Then, trash 2 cards from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Dressrosa",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
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
  i18n: op04Leo091I18n,
};
