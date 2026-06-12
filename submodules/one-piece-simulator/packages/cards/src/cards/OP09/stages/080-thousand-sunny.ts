import type { StageCard } from "@tcg/op-types";
import { op09ThousandSunny080I18n } from "./080-thousand-sunny.i18n.ts";

export const op09ThousandSunny080: StageCard = {
  id: "OP09-080",
  cardType: "stage",
  color: ["purple"],
  rarity: "C",
  setId: "OP09",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Opponent's Turn] You may rest this Stage: When your \"Straw Hat Crew\" type Character is removed from the field by your opponent's effect, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "whenLeaving",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09ThousandSunny080I18n,
};
