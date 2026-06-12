import type { CharacterCard } from "@tcg/op-types";
import { prb02TrafalgarLawSt17002Reprint002I18n } from "./002-trafalgar-law-st17-002-reprint.i18n.ts";

export const prb02TrafalgarLawSt17002Reprint002: CharacterCard = {
  id: "ST17-002",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  traits: ["Heart Pirates The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST17-002_p1.jpg",
      imageId: "ST17-002_p1",
    },
  ],
  effect:
    '[On Play] You may return 1 of your Characters to the owner\'s hand: If your Leader has the "The Seven Warlords of the Sea" type, return up to 1 Character with a cost of 4 or less to the owner\'s hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "The Seven Warlords of the Sea",
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02TrafalgarLawSt17002Reprint002I18n,
};
