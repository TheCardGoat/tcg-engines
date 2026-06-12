import type { CharacterCard } from "@tcg/op-types";
import { op12Patty074I18n } from "./074-patty.i18n.ts";

export const op12Patty074: CharacterCard = {
  id: "OP12-074",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 2000,
  counter: 2000,
  traits: ["East Blue"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 Event from your hand: If your Leader is [Sanji], add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Sanji",
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
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Patty074I18n,
};
