import type { StageCard } from "@tcg/op-types";
import { eb02ThousandSunny009I18n } from "./009-thousand-sunny.i18n.ts";

export const eb02ThousandSunny009: StageCard = {
  id: "EB02-009",
  canonicalId: "EB02-009",
  slug: "thousand-sunny/eb02-009",
  name: "Thousand Sunny",
  printings: [
    {
      id: "EB02-009",
      artId: "EB02-009",
      setCode: "EB02",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-009.jpg",
    },
  ],
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "EB02",
  cost: 2,
  traits: ["Straw Hat Crew"],
  effect:
    '[Activate: Main] You may rest this Stage: Give up to 1 of your currently given DON!! cards to 1 of your "Straw Hat Crew" type Characters.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "redistributeDon",
            count: {
              amount: 1,
              upTo: true,
            },
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                  match: "includes",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02ThousandSunny009I18n,
};
