import type { CharacterCard } from "@tcg/op-types";
import { prb02Mr2BonKureiBenthamReprint061I18n } from "./061-mr-2-bon-kurei-bentham-reprint.i18n.ts";

export const prb02Mr2BonKureiBenthamReprint061: CharacterCard = {
  id: "EB01-061",
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "PRB02",
  cost: 4,
  power: 1000,
  traits: ["Former Baroque Works"],
  attribute: "special",
  effect:
    "[On Play] Add up to 1 DON!! card from your DON!! deck and set it as active.[When Attacking] Select up to 1 of your opponent's Characters. This Character's base power becomes the same as the selected Character's power during this turn.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "setPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 0,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02Mr2BonKureiBenthamReprint061I18n,
};
