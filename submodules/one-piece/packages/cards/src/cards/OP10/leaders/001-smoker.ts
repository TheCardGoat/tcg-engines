import type { LeaderCard } from "@tcg/op-types";
import { op10Smoker001I18n } from "./001-smoker.i18n.ts";

export const op10Smoker001: LeaderCard = {
  id: "OP10-001",
  canonicalId: "OP10-001",
  slug: "smoker/op10-001",
  name: "Smoker",
  printings: [
    {
      id: "OP10-001",
      artId: "OP10-001",
      setCode: "OP10",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-001.jpg",
    },
    {
      id: "OP10-001_p1",
      artId: "OP10-001_p1",
      setCode: "OP10",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-001_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["green", "red"],
  rarity: "L",
  setId: "OP10",
  power: 5000,
  life: 4,
  traits: ["Navy Punk Hazard"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-001_p1.jpg",
      imageId: "OP10-001_p1",
    },
  ],
  effect:
    "[Opponent's Turn] All of your {Navy} or {Punk Hazard} type Characters gain +1000 power.[Activate: Main] [Once Per Turn] If you have a Character with 7000 power or more, set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 7000,
              },
            ],
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
        ],
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
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
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "anyOf",
                  groups: [
                    [
                      {
                        filter: "trait",
                        value: "Navy",
                        match: "includes",
                      },
                    ],
                    [
                      {
                        filter: "trait",
                        value: "Punk Hazard",
                        match: "includes",
                      },
                    ],
                  ],
                },
              ],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op10Smoker001I18n,
};
