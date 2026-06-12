import type { CharacterCard } from "@tcg/op-types";
import { prb02GedatsuReprint102I18n } from "./102-gedatsu-reprint.i18n.ts";

export const prb02GedatsuReprint102: CharacterCard = {
  id: "OP05-102",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Sky Island Vassals"],
  attribute: "strike",
  effect:
    "[On Play] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright) and the Artist Credit (Note: there is no pencil design on top of the artist name).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "opponentLifeCount",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02GedatsuReprint102I18n,
};
