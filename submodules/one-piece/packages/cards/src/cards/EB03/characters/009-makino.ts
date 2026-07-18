import type { CharacterCard } from "@tcg/op-types";
import { eb03Makino009I18n } from "./009-makino.i18n.ts";

export const eb03Makino009: CharacterCard = {
  id: "EB03-009",
  canonicalId: "EB03-009",
  slug: "makino/eb03-009",
  name: "Makino",
  printings: [
    {
      id: "EB03-009",
      artId: "EB03-009",
      setCode: "EB03",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-009_mBvk4wq.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  traits: ["Windmill Village"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may rest this Character: Up to 1 of your Characters with no base effect gains +2000 power during this turn.",
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
                  filter: "noBaseEffect",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Makino009I18n,
};
