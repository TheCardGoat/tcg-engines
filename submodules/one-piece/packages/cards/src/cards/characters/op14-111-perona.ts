import type { CharacterCard } from "@tcg/op-types";
import { op14eb04PeronaOp14111111I18n } from "./op14-111-perona.i18n.ts";

export const op14eb04PeronaOp14111111: CharacterCard = {
  id: "OP14-111",
  canonicalId: "OP14-111",
  slug: "perona/op14-111",
  name: "Perona",
  printings: [
    {
      id: "OP14-111",
      artId: "OP14-111",
      setCode: "OP14",
      collectorNumber: "111",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-111_hWZq5nk.jpg",
      label: "Perona - OP14-111",
    },
    {
      id: "OP14-111_p1",
      artId: "OP14-111_p1",
      setCode: "OP14",
      collectorNumber: "111",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-111_p1_NcAFI0k.jpg",
      label: "Perona - OP14-111 (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP14",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
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
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
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
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op14eb04PeronaOp14111111I18n,
};
