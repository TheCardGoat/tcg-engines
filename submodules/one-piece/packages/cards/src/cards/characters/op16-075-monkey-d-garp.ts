import type { CharacterCard } from "@tcg/op-types";
import { op16MonkeyDGarp075I18n } from "./op16-075-monkey-d-garp.i18n.ts";

export const op16MonkeyDGarp075: CharacterCard = {
  id: "OP16-075",
  canonicalId: "OP16-075",
  slug: "monkey-d-garp/op16-075",
  name: "Monkey.D.Garp",
  printings: [
    {
      id: "OP16-075",
      artId: "OP16-075",
      setCode: "OP16",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-075_mB8Qz3U.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP16",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader has the {Navy} type, add up to 1 DON!! card from your DON!! deck and set it as active, and add up to 1 additional DON!! card and rest it.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op16MonkeyDGarp075I18n,
};
