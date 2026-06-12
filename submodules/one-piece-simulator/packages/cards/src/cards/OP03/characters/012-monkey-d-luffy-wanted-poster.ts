import type { CharacterCard } from "@tcg/op-types";
import { op03MonkeyDLuffyWantedPoster012I18n } from "./012-monkey-d-luffy-wanted-poster.i18n.ts";

export const op03MonkeyDLuffyWantedPoster012: CharacterCard = {
  id: "ST01-012",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP03",
  cost: 5,
  power: 6000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.) [DON!! x2] [When Attacking] Your opponent cannot activate [Blocker] during this battle.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            keyword: "blocker",
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op03MonkeyDLuffyWantedPoster012I18n,
};
