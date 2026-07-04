import type { CharacterCard } from "@tcg/op-types";
import { op09Heat007I18n } from "./007-heat.i18n.ts";

export const op09Heat007: CharacterCard = {
  id: "OP09-007",
  canonicalId: "OP09-007",
  slug: "heat",
  name: "Heat",
  printings: [
    {
      id: "OP09-007",
      artId: "OP09-007",
      setCode: "OP09",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-007.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Up to 1 of your Leader with 4000 power or less gains +1000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op09Heat007I18n,
};
