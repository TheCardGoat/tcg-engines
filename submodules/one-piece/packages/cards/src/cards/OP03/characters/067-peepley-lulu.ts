import type { CharacterCard } from "@tcg/op-types";
import { op03PeepleyLulu067I18n } from "./067-peepley-lulu.i18n.ts";

export const op03PeepleyLulu067: CharacterCard = {
  id: "OP03-067",
  canonicalId: "OP03-067",
  slug: "peepley-lulu",
  name: "Peepley Lulu",
  printings: [
    {
      id: "OP03-067",
      artId: "OP03-067",
      setCode: "OP03",
      collectorNumber: "067",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-067.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP03",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "ranged",
  effect:
    "[DON!! x1] [When Attacking] If your Leader has the [Galley-La Company] type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "leaderTrait",
            trait: "Galley-La Company",
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
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op03PeepleyLulu067I18n,
};
