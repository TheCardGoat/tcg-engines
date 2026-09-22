import type { CharacterCard } from "@tcg/op-types";
import { op15Amazon059I18n } from "./op15-059-amazon.i18n.ts";

export const op15Amazon059: CharacterCard = {
  id: "OP15-059",
  canonicalId: "OP15-059",
  slug: "amazon/op15-059",
  name: "Amazon",
  printings: [
    {
      id: "OP15-059",
      artId: "OP15-059",
      setCode: "OP15",
      collectorNumber: "059",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-059_P8N5f0P.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP15",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "wisdom",
  effect:
    "[On Your Opponent's Attack] You may rest this Character: Your opponent may return 1 of their active DON!! cards to their DON!! deck. If they do not, give up to 1 of your opponent's Leader or Character cards -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        optional: true,
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "choice",
            player: "opponent",
            options: [
              [
                {
                  action: "returnDon",
                  player: "opponent",
                  amount: 1,
                },
              ],
              [
                {
                  action: "modifyPower",
                  target: {
                    player: "opponent",
                    zones: ["leader", "character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                  value: -2000,
                  duration: "thisTurn",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op15Amazon059I18n,
};
