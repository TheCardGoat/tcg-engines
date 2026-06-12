import type { CharacterCard } from "@tcg/op-types";
import { prb01SaboOp05007Reprint007I18n } from "./007-sabo-op05-007-reprint.i18n.ts";

export const prb01SaboOp05007Reprint007: CharacterCard = {
  id: "OP05-007",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB01",
  cost: 6,
  power: 7000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-007_p3.jpg",
      imageId: "OP05-007_p3",
    },
  ],
  effect:
    "[On Play] K.O. up to 2 of your opponent's Characters with a total power of 4000 or less.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
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
                amount: 2,
                upTo: true,
              },
              totalConstraint: {
                property: "power",
                comparison: "lte",
                value: 4000,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: prb01SaboOp05007Reprint007I18n,
};
