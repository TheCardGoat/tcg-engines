import type { StageCard } from "@tcg/op-types";
import { op09ThousandSunny080I18n } from "./080-thousand-sunny.i18n.ts";

export const op09ThousandSunny080: StageCard = {
  id: "OP09-080",
  canonicalId: "OP09-080",
  slug: "thousand-sunny/op09-080",
  name: "Thousand Sunny",
  printings: [
    {
      id: "OP09-080",
      artId: "OP09-080",
      setCode: "OP09",
      collectorNumber: "080",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-080.jpg",
    },
  ],
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
        eventFilter: {
          player: "self",
          causedBy: "opponent",
          filters: [
            {
              filter: "trait",
              value: "Straw Hat Crew",
              match: "includes",
            },
          ],
        },
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
