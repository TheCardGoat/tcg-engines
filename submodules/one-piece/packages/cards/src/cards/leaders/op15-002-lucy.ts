import type { LeaderCard } from "@tcg/op-types";
import { op15Lucy002I18n } from "./op15-002-lucy.i18n.ts";

export const op15Lucy002: LeaderCard = {
  id: "OP15-002",
  canonicalId: "OP15-002",
  slug: "lucy/op15-002",
  name: "Lucy",
  printings: [
    {
      id: "OP15-002",
      artId: "OP15-002",
      setCode: "OP15",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-002_9JJSMVX.jpg",
    },
    {
      id: "OP15-002_p1",
      artId: "OP15-002_p1",
      setCode: "OP15",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-002_p1_bm75Dds.jpg",
      label: "Lucy (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["blue", "red"],
  rarity: "L",
  setId: "OP15",
  power: 5000,
  life: 4,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "strike",
  effect:
    "[When Attacking]/[On Your Opponent's Attack] You may trash any number of Event or Stage cards from your hand. This Leader gains +1000 power during this battle for every card trashed.\n[Activate: Main] [Once Per Turn] If you have activated an Event with a base cost of 3 or more during this turn, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "activatedEvent",
            baseCost: {
              comparison: "gte",
              value: 3,
            },
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: "all",
            upTo: true,
            filters: [
              {
                filter: "anyOf",
                groups: [
                  [
                    {
                      filter: "cardCategory",
                      value: "event",
                    },
                  ],
                  [
                    {
                      filter: "cardCategory",
                      value: "stage",
                    },
                  ],
                ],
              },
            ],
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
            value: 0,
            valuePerPreviousActionTarget: 1000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
      {
        trigger: "onOpponentAttack",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: "all",
            upTo: true,
            filters: [
              {
                filter: "anyOf",
                groups: [
                  [
                    {
                      filter: "cardCategory",
                      value: "event",
                    },
                  ],
                  [
                    {
                      filter: "cardCategory",
                      value: "stage",
                    },
                  ],
                ],
              },
            ],
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
            value: 0,
            valuePerPreviousActionTarget: 1000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op15Lucy002I18n,
};
