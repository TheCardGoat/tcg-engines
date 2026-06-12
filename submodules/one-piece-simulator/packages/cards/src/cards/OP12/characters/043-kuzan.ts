import type { CharacterCard } from "@tcg/op-types";
import { op12Kuzan043I18n } from "./043-kuzan.i18n.ts";

export const op12Kuzan043: CharacterCard = {
  id: "OP12-043",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP12",
  cost: 6,
  power: 8000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-043_p1_uwyGXaK.jpg",
      imageId: "OP12-043_p1",
    },
  ],
  effect:
    "If you have 5 or more cards in your hand, this Character gains +1 cost.\n[On Play] You may trash 1 card from your hand: Up to 1 of your opponent's Characters cannot attack until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Kuzan043I18n,
};
