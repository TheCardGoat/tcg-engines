import type { LeaderCard } from "@tcg/op-types";
import { op16PortgasDAce001I18n } from "./op16-001-portgas-d-ace.i18n.ts";

export const op16PortgasDAce001: LeaderCard = {
  id: "OP16-001",
  canonicalId: "OP16-001",
  slug: "portgas-d-ace/op16-001",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "OP16-001",
      artId: "OP16-001",
      setCode: "OP16",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-001_xBcGSbE.jpg",
      label: "Portgas.D.Ace (001)",
    },
    {
      id: "OP16-001_p1",
      artId: "OP16-001_p1",
      setCode: "OP16",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-001_p1_ra2rQjc.jpg",
      label: "Portgas.D.Ace (001) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "OP16",
  power: 5000,
  life: 5,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    '[Activate:Main] [Once Per Turn] Up to 1 of your [Monkey.D.Luffy] Characters or up to 1 of your Characters with a type including "Whitebeard Pirates", with 8000 power or more, gains [Rush] during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
        actions: [
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
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "name",
                      value: "Monkey.D.Luffy",
                    },
                    {
                      filter: "allOf",
                      filters: [
                        {
                          filter: "trait",
                          value: "Whitebeard Pirates",
                          match: "includes",
                        },
                        {
                          filter: "power",
                          comparison: "gte",
                          value: 8000,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op16PortgasDAce001I18n,
};
