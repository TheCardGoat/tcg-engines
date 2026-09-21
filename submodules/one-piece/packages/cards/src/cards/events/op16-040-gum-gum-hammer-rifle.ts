import type { EventCard } from "@tcg/op-types";
import { op16GumGumHammerRifle040I18n } from "./op16-040-gum-gum-hammer-rifle.i18n.ts";

export const op16GumGumHammerRifle040: EventCard = {
  id: "OP16-040",
  canonicalId: "OP16-040",
  slug: "gum-gum-hammer-rifle/op16-040",
  name: "Gum-Gum Hammer Rifle",
  printings: [
    {
      id: "OP16-040",
      artId: "OP16-040",
      setCode: "OP16",
      collectorNumber: "040",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-040_gD10VSF.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  traits: ["Straw Hat Crew Impel Down"],
  effect:
    "[Main] If you have [Monkey.D.Luffy] and [Mr.3(Galdino)], up to 1 of your opponent's rested Characters with a cost of 6 or less will not become active in your opponent's next Refresh Phase.\n\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "existsOnField",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "name",
                value: "Monkey.D.Luffy",
              },
            ],
          },
          {
            condition: "existsOnField",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "name",
                value: "Mr.3(Galdino)",
              },
            ],
          },
        ],
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op16GumGumHammerRifle040I18n,
};
