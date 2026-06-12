import type { CharacterCard } from "@tcg/op-types";
import { prb01KoalaReprint006I18n } from "./006-koala-reprint.i18n.ts";

export const prb01KoalaReprint006: CharacterCard = {
  id: "OP05-006",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB01",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Revolutionary Army"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_p3.jpg",
      imageId: "OP05-006_p3",
    },
  ],
  effect:
    "[On Play] If your Leader has the [Revolutionary Army] type, give up to 1 of your opponent's Characters -3000 power during this turn.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Revolutionary Army",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb01KoalaReprint006I18n,
};
