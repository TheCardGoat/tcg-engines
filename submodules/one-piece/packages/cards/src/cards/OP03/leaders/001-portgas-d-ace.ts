import type { LeaderCard } from "@tcg/op-types";
import { op03PortgasDAce001I18n } from "./001-portgas-d-ace.i18n.ts";

export const op03PortgasDAce001: LeaderCard = {
  id: "OP03-001",
  canonicalId: "OP03-001",
  slug: "portgas-d-ace/op03-001",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "OP03-001",
      artId: "OP03-001",
      setCode: "OP03",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-001.jpg",
    },
    {
      id: "OP03-001_p1",
      artId: "OP03-001_p1",
      setCode: "OP03",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-001_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "OP03",
  power: 5000,
  life: 5,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-001_p1.jpg",
      imageId: "OP03-001_p1",
    },
  ],
  effect:
    "When this Leader attacks or is attacked, you may trash any number of Event or Stage cards from your hand. This Leader gains +1000 power during this battle for every card trashed.",
  effects: {
    effects: [
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
                  [{ filter: "cardCategory", value: "event" }],
                  [{ filter: "cardCategory", value: "stage" }],
                ],
              },
            ],
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: { amount: 1 },
              self: true,
            },
            value: 0,
            valuePerPreviousActionTarget: 1000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        eventFilter: { targetSelf: true },
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
                  [{ filter: "cardCategory", value: "event" }],
                  [{ filter: "cardCategory", value: "stage" }],
                ],
              },
            ],
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: { amount: 1 },
              self: true,
            },
            value: 0,
            valuePerPreviousActionTarget: 1000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op03PortgasDAce001I18n,
};
