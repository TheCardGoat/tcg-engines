import type { CharacterCard } from "@tcg/op-types";
import { op13MarshallDTeach053I18n } from "./053-marshall-d-teach.i18n.ts";

export const op13MarshallDTeach053: CharacterCard = {
  id: "OP13-053",
  canonicalId: "OP13-053",
  slug: "marshall-d-teach/op13-053",
  name: "Marshall.D.Teach",
  printings: [
    {
      id: "OP13-053",
      artId: "OP13-053",
      setCode: "OP13",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-053_4lZ6pN9.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    '[When Attacking] You may trash 1 of your Characters with a type including "Whitebeard Pirates": Draw 1 card and this Character gains [Banish] during this turn.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "banish",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13MarshallDTeach053I18n,
};
