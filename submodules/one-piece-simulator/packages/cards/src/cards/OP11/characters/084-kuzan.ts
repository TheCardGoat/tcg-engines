import type { CharacterCard } from "@tcg/op-types";
import { op11Kuzan084I18n } from "./084-kuzan.i18n.ts";

export const op11Kuzan084: CharacterCard = {
  id: "OP11-084",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-084_p1.jpg",
      imageId: "OP11-084_p1",
    },
  ],
  effect:
    '[On Play] Trash 3 cards from the top of your deck.\n[When Attacking] Up to 1 of your "Navy" type Leader or Character cards can also attack active Characters during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Navy",
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op11Kuzan084I18n,
};
