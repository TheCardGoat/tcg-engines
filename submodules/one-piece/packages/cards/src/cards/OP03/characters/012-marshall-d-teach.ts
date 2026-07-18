import type { CharacterCard } from "@tcg/op-types";
import { op03MarshallDTeach012I18n } from "./012-marshall-d-teach.i18n.ts";

export const op03MarshallDTeach012: CharacterCard = {
  id: "OP03-012",
  canonicalId: "OP03-012",
  slug: "marshall-d-teach/op03-012",
  name: "Marshall.D.Teach",
  printings: [
    {
      id: "OP03-012",
      artId: "OP03-012",
      setCode: "OP03",
      collectorNumber: "012",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-012.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP03",
  cost: 4,
  power: 6000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    "[When Attacking] You may trash 1 of your red Characters with 4000 power or more: Draw 1 card. Then, this Character gains +1000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashCharacter",
            amount: 1,
            filters: [
              {
                filter: "color",
                value: "red",
              },
              {
                filter: "power",
                comparison: "gte",
                value: 4000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
            value: 1000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03MarshallDTeach012I18n,
};
