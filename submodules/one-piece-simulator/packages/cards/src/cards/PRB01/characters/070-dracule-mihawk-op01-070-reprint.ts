import type { CharacterCard } from "@tcg/op-types";
import { prb01DraculeMihawkOp01070Reprint070I18n } from "./070-dracule-mihawk-op01-070-reprint.i18n.ts";

export const prb01DraculeMihawkOp01070Reprint070: CharacterCard = {
  id: "OP01-070",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "PRB01",
  cost: 9,
  power: 9000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-070_p4.jpg",
      imageId: "OP01-070_p4",
    },
  ],
  effect:
    "[On Play] Place up to 1 Character with a cost of 7 or less at the bottom of the owner's deck.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
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
                  value: 7,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb01DraculeMihawkOp01070Reprint070I18n,
};
