import type { EventCard } from "@tcg/op-types";
import { op10GumGumRhinoSchneider097I18n } from "./097-gum-gum-rhino-schneider.i18n.ts";

export const op10GumGumRhinoSchneider097: EventCard = {
  id: "OP10-097",
  canonicalId: "OP10-097",
  slug: "gum-gum-rhino-schneider",
  name: "Gum-Gum Rhino Schneider",
  printings: [
    {
      id: "OP10-097",
      artId: "OP10-097",
      setCode: "OP10",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-097.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP10",
  cost: 1,
  trigger: "Draw 2 cards and trash 1 card from your hand.",
  traits: ["Straw Hat Crew Supernovas Dressrosa"],
  effect:
    '[Main] Up to 1 of your "Dressrosa" type Characters gains +2000 power during this turn. Then, if you have 10 or more cards in your trash, that card gains [Banish] during this turn.',
  effects: {
    effects: [
      {
        trigger: "main",
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
                  filter: "trait",
                  value: "Dressrosa",
                  match: "includes",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
            keyword: "banish",
            duration: "thisTurn",
            previousActionTargets: true,
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 10,
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          { action: "draw", player: "self", amount: 2 },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op10GumGumRhinoSchneider097I18n,
};
