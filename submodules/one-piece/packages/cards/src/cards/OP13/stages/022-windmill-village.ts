import type { StageCard } from "@tcg/op-types";
import { op13WindmillVillage022I18n } from "./022-windmill-village.i18n.ts";

export const op13WindmillVillage022: StageCard = {
  id: "OP13-022",
  canonicalId: "OP13-022",
  slug: "windmill-village",
  name: "Windmill Village",
  printings: [
    {
      id: "OP13-022",
      artId: "OP13-022",
      setCode: "OP13",
      collectorNumber: "022",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-022_HfJTKSB.jpg",
    },
  ],
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  traits: ["Windmill Village"],
  effect:
    "[Activate: Main] You may rest this Stage: Up to 1 of your Characters with 2000 base power or less gains +1000 power during this turn.",
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 2000,
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13WindmillVillage022I18n,
};
