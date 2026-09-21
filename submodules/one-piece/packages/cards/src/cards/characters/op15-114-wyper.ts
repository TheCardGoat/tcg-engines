import type { CharacterCard } from "@tcg/op-types";
import { op15Wyper114I18n } from "./op15-114-wyper.i18n.ts";

export const op15Wyper114: CharacterCard = {
  id: "OP15-114",
  canonicalId: "OP15-114",
  slug: "wyper/op15-114",
  name: "Wyper",
  printings: [
    {
      id: "OP15-114",
      artId: "OP15-114",
      setCode: "OP15",
      collectorNumber: "114",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-114_W7W9iZq.jpg",
    },
    {
      id: "OP15-114_p1",
      artId: "OP15-114_p1",
      setCode: "OP15",
      collectorNumber: "114",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-114_p1_pjA9nX3.jpg",
      label: "Wyper (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP15",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  effect:
    "[On Play] You may turn 1 card from the top of your Life cards face-up: Give all of your opponent's Characters 2000 power during this turn. Then, K.O. all of your opponent's Characters with 0 power or less.\n[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to 1 of your {Sky Island} type Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
            faceUp: true,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 0,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Sky Island",
                  match: "includes",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op15Wyper114I18n,
};
