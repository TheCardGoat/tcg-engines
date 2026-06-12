import type { LeaderCard } from "@tcg/op-types";
import { eb02MonkeyDLuffy010I18n } from "./010-monkey-d-luffy.i18n.ts";

export const eb02MonkeyDLuffy010: LeaderCard = {
  id: "EB02-010",
  cardType: "leader",
  color: ["green", "purple"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-010_p1.png",
      imageId: "EB02-010_p1",
    },
  ],
  effect:
    '[Activate: Main] [Once Per Turn] DON!! 2: If the only Characters on your field are "Straw Hat Crew" type Characters, set up to 2 of your DON!! cards as active. Then, this Leader gains +1000 power until the end of your opponent\'s next turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "eq",
            value: 0,
            filters: [
              {
                filter: "trait",
                value: "Straw Hat Crew",
                negate: true,
              },
            ],
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02MonkeyDLuffy010I18n,
};
