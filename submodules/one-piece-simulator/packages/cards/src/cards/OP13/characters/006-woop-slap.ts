import type { CharacterCard } from "@tcg/op-types";
import { op13WoopSlap006I18n } from "./006-woop-slap.i18n.ts";

export const op13WoopSlap006: CharacterCard = {
  id: "OP13-006",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Windmill Village"],
  attribute: "wisdom",
  effect: "[On Play] Give up to 2 rested DON!! cards to 1 of your [Monkey.D.Luffy] cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op13WoopSlap006I18n,
};
