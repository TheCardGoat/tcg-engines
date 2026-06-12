import type { CharacterCard } from "@tcg/op-types";
import { op03PeepleyLulu067I18n } from "./067-peepley-lulu.i18n.ts";

export const op03PeepleyLulu067: CharacterCard = {
  id: "OP03-067",
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
