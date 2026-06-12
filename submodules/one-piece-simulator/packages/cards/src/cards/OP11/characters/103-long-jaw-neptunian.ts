import type { CharacterCard } from "@tcg/op-types";
import { op11LongJawNeptunian103I18n } from "./103-long-jaw-neptunian.i18n.ts";

export const op11LongJawNeptunian103: CharacterCard = {
  id: "OP11-103",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 7000,
  traits: ["Neptunian"],
  attribute: "strike",
  effect:
    "[Activate: Main] If your Leader is [Shirahoshi], you may rest this Character and turn 1 card from the top of your Life cards face-down: K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderName",
            name: "Shirahoshi",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11LongJawNeptunian103I18n,
};
