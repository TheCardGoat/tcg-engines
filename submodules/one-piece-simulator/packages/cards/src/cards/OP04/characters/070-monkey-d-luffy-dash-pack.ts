import type { CharacterCard } from "@tcg/op-types";
import { op04MonkeyDLuffyDashPack070I18n } from "./070-monkey-d-luffy-dash-pack.i18n.ts";

export const op04MonkeyDLuffyDashPack070: CharacterCard = {
  id: "OP03-070",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP04",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew Water Seven"],
  attribute: "strike",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.) You may trash 1 Character card with a cost of 5 from your hand: This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
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
  i18n: op04MonkeyDLuffyDashPack070I18n,
};
