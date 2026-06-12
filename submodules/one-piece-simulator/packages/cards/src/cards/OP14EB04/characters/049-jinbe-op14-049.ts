import type { CharacterCard } from "@tcg/op-types";
import { op14eb04JinbeOp14049049I18n } from "./049-jinbe-op14-049.i18n.ts";

export const op14eb04JinbeOp14049049: CharacterCard = {
  id: "OP14-049",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 8,
  power: 10000,
  traits: ["Fish-Man The Seven Warlords of the Sea The Sun Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-049_p1_IdEefPK.jpg",
      imageId: "OP14-049_p1",
    },
  ],
  effect:
    "When a card is trashed from your hand by an effect, this Character gains [Rush] during this turn.\n[On Play] You may rest 2 of your DON!! cards: Draw 2 cards and return up to 1 Character with a cost of 7 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
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
                  value: 7,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04JinbeOp14049049I18n,
};
