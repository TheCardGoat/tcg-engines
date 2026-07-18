import type { CharacterCard } from "@tcg/op-types";
import { op11CharlotteLinlin073I18n } from "./073-charlotte-linlin.i18n.ts";

export const op11CharlotteLinlin073: CharacterCard = {
  id: "OP11-073",
  canonicalId: "OP11-073",
  slug: "charlotte-linlin/op11-073",
  name: "Charlotte Linlin",
  printings: [
    {
      id: "OP11-073",
      artId: "OP11-073",
      setCode: "OP11",
      collectorNumber: "073",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-073.jpg",
    },
    {
      id: "OP11-073_p1",
      artId: "OP11-073_p1",
      setCode: "OP11",
      collectorNumber: "073",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-073_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP11",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Big Mom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-073_p1.jpg",
      imageId: "OP11-073_p1",
    },
  ],
  effect:
    "If your Leader has the \"Big Mom Pirates\" type, this Character gains [Rush].\n[On Your Opponent's Attack] [Once Per Turn] DON!! −5: Choose a cost and reveal 1 card from the top of your opponent's deck. If the revealed card has the chosen cost, up to 1 of your Leader gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "returnDon",
            amount: 5,
          },
        ],
        actions: [
          {
            action: "guessTopDeckCost",
            player: "opponent",
            onMatch: [
              {
                action: "modifyPower",
                target: {
                  player: "self",
                  zones: ["leader"],
                  count: {
                    amount: 1,
                    upTo: true,
                  },
                },
                value: 2000,
                duration: "thisTurn",
              },
            ],
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Big Mom Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op11CharlotteLinlin073I18n,
};
