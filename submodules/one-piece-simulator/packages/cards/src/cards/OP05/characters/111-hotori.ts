import type { CharacterCard } from "@tcg/op-types";
import { op05Hotori111I18n } from "./111-hotori.i18n.ts";

export const op05Hotori111: CharacterCard = {
  id: "OP05-111",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP05",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "special",
  effect:
    "[On Play] You may play 1 [Kotori] from your hand: Add up to 1 of your opponent's Characters with a cost of 3 or less to the top or bottom of your opponent's Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
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
                  value: 3,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Hotori111I18n,
};
