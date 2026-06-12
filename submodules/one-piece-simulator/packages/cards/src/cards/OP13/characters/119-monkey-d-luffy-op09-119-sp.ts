import type { CharacterCard } from "@tcg/op-types";
import { op13MonkeyDLuffyOp09119Sp119I18n } from "./119-monkey-d-luffy-op09-119-sp.i18n.ts";

export const op13MonkeyDLuffyOp09119Sp119: CharacterCard = {
  id: "OP09-119",
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "OP13",
  cost: 9,
  power: 10000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] You may return 1 or more DON!! cards from your field to your DON!! deck: Draw 1 card and this Character gains [Rush] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13MonkeyDLuffyOp09119Sp119I18n,
};
