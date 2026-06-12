import type { CharacterCard } from "@tcg/op-types";
import { op12Hina051I18n } from "./051-hina.i18n.ts";

export const op12Hina051: CharacterCard = {
  id: "OP12-051",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP12",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[Activate: Main] You may rest this Character and trash 1 card from your hand: Up to 1 of your opponent's Characters with a base cost of 4 or less cannot activate [Blocker] during this turn.",
  effects: {
    effects: [
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
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Hina051I18n,
};
