import type { LeaderCard } from "@tcg/op-types";
import { op05BeloBetty002I18n } from "./op05-002-belo-betty.i18n.ts";

export const op05BeloBetty002: LeaderCard = {
  id: "OP05-002",
  canonicalId: "OP05-002",
  slug: "belo-betty/op05-002",
  name: "Belo Betty",
  printings: [
    {
      id: "OP05-002",
      artId: "OP05-002",
      setCode: "OP05",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-002.jpg",
    },
    {
      id: "OP05-002_p1",
      artId: "OP05-002_p1",
      setCode: "OP05",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-002_p1.jpg",
    },
    {
      id: "OP05-002_p2",
      artId: "OP05-002_p2",
      setCode: "OP05",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-002_p2.jpg",
      label: "Belo Betty (SPR)",
    },
  ],
  cardType: "leader",
  color: ["red", "yellow"],
  rarity: "L",
  setId: "OP05",
  power: 5000,
  life: 4,
  traits: ["Revolutionary Army"],
  attribute: "special",

  effect:
    "[Activate:Main][Once Per Turn] You may trash 1 [Revolutionary Army] type card from your hand: Up to 3 of your [Revolutionary Army] type Characters or Characters with a [Trigger] gain +3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Revolutionary Army",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 3,
                upTo: true,
              },
              filters: [
                {
                  filter: "anyOf",
                  groups: [
                    [
                      {
                        filter: "trait",
                        value: "Revolutionary Army",
                        match: "includes",
                      },
                    ],
                    [{ filter: "hasTrigger", value: true }],
                  ],
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05BeloBetty002I18n,
};
