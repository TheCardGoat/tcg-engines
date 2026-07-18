import type { EventCard } from "@tcg/op-types";
import { op04GumGumKingKongGun093I18n } from "./093-gum-gum-king-kong-gun.i18n.ts";

export const op04GumGumKingKongGun093: EventCard = {
  id: "OP04-093",
  canonicalId: "OP04-093",
  slug: "gum-gum-king-kong-gun",
  name: "Gum-Gum King Kong Gun",
  printings: [
    {
      id: "OP04-093",
      artId: "OP04-093",
      setCode: "OP04",
      collectorNumber: "093",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-093.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  traits: ["Straw Hat Crew Dressrosa"],
  effect:
    "[Main] Up to 1 of your [Dressrosa] type Characters gains +6000 power during this turn. Then, if you have 15 or more cards in your trash, that card gains [Double Attack] during this turn. (This card deals 2 damage.) [Trigger] Draw 3 cards and trash 2 cards from your hand.",
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
            value: 6000,
            duration: "thisTurn",
          },
          {
            action: "grantKeyword",
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
            keyword: "doubleAttack",
            duration: "thisTurn",
            previousActionTargets: true,
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 15,
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op04GumGumKingKongGun093I18n,
};
