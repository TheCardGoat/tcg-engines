import type { CharacterCard } from "@tcg/op-types";
import { op14eb04PeronaOp14111111I18n } from "./111-perona-op14-111.i18n.ts";

export const op14eb04PeronaOp14111111: CharacterCard = {
  id: "OP14-111",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-111_p1_NcAFI0k.jpg",
      imageId: "OP14-111_p1",
    },
  ],
  effect:
    "[On Play]/[On K.O.] Up to 1 of your opponent's Characters with a cost of 6 or less cannot attack until the end of your opponent's next End Phase.",
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
                  value: 6,
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "onKo",
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
                  value: 6,
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: op14eb04PeronaOp14111111I18n,
};
