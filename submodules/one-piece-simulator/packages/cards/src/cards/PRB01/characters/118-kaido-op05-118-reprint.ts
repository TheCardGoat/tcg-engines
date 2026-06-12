import type { CharacterCard } from "@tcg/op-types";
import { prb01KaidoOp05118Reprint118I18n } from "./118-kaido-op05-118-reprint.i18n.ts";

export const prb01KaidoOp05118Reprint118: CharacterCard = {
  id: "OP05-118",
  cardType: "character",
  color: ["blue"],
  rarity: "SEC",
  setId: "PRB01",
  cost: 10,
  power: 12000,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-118_p3.jpg",
      imageId: "OP05-118_p3",
    },
  ],
  effect:
    "[On Play] Draw 4 cards if your opponent has 3 or less Life cards.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 4,
            condition: {
              condition: "lifeCount",
              player: "opponent",
              comparison: "lte",
              value: 3,
            },
          },
        ],
      },
    ],
  },
  i18n: prb01KaidoOp05118Reprint118I18n,
};
