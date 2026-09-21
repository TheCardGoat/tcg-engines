import type { CharacterCard } from "@tcg/op-types";
import { op17Sweet3Generals114I18n } from "./op17-114-sweet-3-generals.i18n.ts";

export const op17Sweet3Generals114: CharacterCard = {
  id: "OP17-114",
  canonicalId: "OP17-114",
  slug: "sweet-3-generals/op17-114",
  name: "Sweet 3 Generals",
  printings: [
    {
      id: "OP17-114",
      artId: "OP17-114",
      setCode: "OP17",
      collectorNumber: "114",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-114_tWIf95P.jpg",
    },
    {
      id: "OP17-114_p1",
      artId: "OP17-114_p1",
      setCode: "OP17",
      collectorNumber: "114",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-114_p1_USqKnVi.jpg",
      label: "Sweet 3 Generals (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP17",
  cost: 6,
  power: 4000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Big Mom Pirates"],
  attribute: ["slash", "strike"],
  effect:
    "[Your Turn] [On Play] You may rest 2 of your DON!! cards: Draw 1 card and add up to 1 card from the top of your deck to the top of your Life cards. Then, give up to 2 of your opponent's Characters -3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op17Sweet3Generals114I18n,
};
