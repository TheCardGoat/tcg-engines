import type { StageCard } from "@tcg/op-types";
import { op06TheArkMaxim117I18n } from "./117-the-ark-maxim.i18n.ts";

export const op06TheArkMaxim117: StageCard = {
  id: "OP06-117",
  cardType: "stage",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  traits: ["Sky Island"],
  effect:
    "[Activate:Main][Once Per Turn] You may rest this card and 1 of your [Enel] cards: K.O. all of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06TheArkMaxim117I18n,
};
