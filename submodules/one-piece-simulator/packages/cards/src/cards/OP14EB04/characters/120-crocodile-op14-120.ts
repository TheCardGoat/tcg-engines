import type { CharacterCard } from "@tcg/op-types";
import { op14eb04CrocodileOp14120120I18n } from "./120-crocodile-op14-120.i18n.ts";

export const op14eb04CrocodileOp14120120: CharacterCard = {
  id: "OP14-120",
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "OP14EB04",
  cost: 8,
  power: 10000,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-120_p1_JDoyJx2.jpg",
      imageId: "OP14-120_p1",
    },
  ],
  effect:
    "[On Play] up to 1 of your opponent's Characters with a cost of 9 or less cannot attack until the end of your opponent's next End Phase. Then, if your opponent has a Character 1ith a cost of 0 or with a cost of 8 or more, draw 1 card.\n[On K.O.] You may trash 1 card from your hand: Play this Character card from your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 9,
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "onKo",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04CrocodileOp14120120I18n,
};
