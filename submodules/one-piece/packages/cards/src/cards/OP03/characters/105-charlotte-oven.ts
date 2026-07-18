import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteOven105I18n } from "./105-charlotte-oven.i18n.ts";

export const op03CharlotteOven105: CharacterCard = {
  id: "OP03-105",
  canonicalId: "OP03-105",
  slug: "charlotte-oven/op03-105",
  name: "Charlotte Oven",
  printings: [
    {
      id: "OP03-105",
      artId: "OP03-105",
      setCode: "OP03",
      collectorNumber: "105",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-105.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[DON!! x1] [When Attacking] You may trash 1 card with a [Trigger] from your hand: This Character gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [{ filter: "hasTrigger", value: true }],
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
              },
              self: true,
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03CharlotteOven105I18n,
};
