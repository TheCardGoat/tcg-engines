import type { LeaderCard } from "@tcg/op-types";
import { st30LuffyAce001I18n } from "./st30-001-luffy-ace.i18n.ts";
export const st30LuffyAce001: LeaderCard = {
  id: "ST30-001",
  canonicalId: "ST30-001",
  slug: "luffy-ace/st30-001",
  name: "Luffy & Ace",
  printings: [
    {
      id: "ST30-001",
      artId: "ST30-001",
      setCode: "ST30",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-001.png",
    },
  ],
  cardType: "leader",
  color: ["red", "green"],
  rarity: "L",
  setId: "ST30",
  life: 4,
  traits: ["Impel Down", "Whitebeard Pirates", "Straw Hat Crew"],
  power: 6000,
  attribute: ["strike", "special"],
  effect:
    "If you have a Character with 7000 base power or more, give this Leader −2000 power. [Opponent's Turn] All of your [Portgas.D.Ace] and [Monkey.D.Luffy] cards gain +3000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "basePower",
                comparison: "gte",
                value: 7000,
              },
            ],
          },
        ],
        actions: [
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
            value: -2000,
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character", "stage"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "name",
                      value: "Portgas.D.Ace",
                    },
                    {
                      filter: "name",
                      value: "Monkey.D.Luffy",
                    },
                  ],
                },
              ],
            },
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st30LuffyAce001I18n,
};
