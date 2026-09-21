import type { LeaderCard } from "@tcg/op-types";
import { op16MonkeyDLuffy022I18n } from "./op16-022-monkey-d-luffy.i18n.ts";

export const op16MonkeyDLuffy022: LeaderCard = {
  id: "OP16-022",
  canonicalId: "OP16-022",
  slug: "monkey-d-luffy/op16-022",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP16-022",
      artId: "OP16-022",
      setCode: "OP16",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-022_bCG0wyv.jpg",
      label: "Monkey.D.Luffy (022)",
    },
    {
      id: "OP16-022_p1",
      artId: "OP16-022_p1",
      setCode: "OP16",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-022_p1_NLeZnzz.jpg",
      label: "Monkey.D.Luffy (022) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["blue", "green"],
  rarity: "L",
  setId: "OP16",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew Impel Down"],
  attribute: "strike",
  effect:
    "[Activate:Main] [Once Per Turn] If the only Characters on your field are {Impel Down} type Characters, set up to 2 of your DON!! cards as active.",
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
                value: "Impel Down",
                match: "includes",
                negate: true,
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
  },
  i18n: op16MonkeyDLuffy022I18n,
};
