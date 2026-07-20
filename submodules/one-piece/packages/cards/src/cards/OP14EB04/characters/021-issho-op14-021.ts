import type { CharacterCard } from "@tcg/op-types";
import { op14eb04IsshoOp14021021I18n } from "./021-issho-op14-021.i18n.ts";

export const op14eb04IsshoOp14021021: CharacterCard = {
  id: "OP14-021",
  canonicalId: "OP14-021",
  slug: "issho/op14-021",
  name: "Issho",
  printings: [
    {
      id: "OP14-021",
      artId: "OP14-021",
      setCode: "OP14EB04",
      collectorNumber: "021",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-021_LI6cqx3.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Dressrosa", "Navy"],
  attribute: "slash",
  effect:
    "[Your Turn] When this Character becomes rested, you may add 1 card from the top of your Life cards to your hand. If you do, up to 1 of your opponent's rested Characters or Stages will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "whenBecomesRested",
        eventFilter: {
          targetSelf: true,
        },
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
            thenActions: [
              {
                action: "freeze",
                target: {
                  player: "opponent",
                  zones: ["character", "stage"],
                  count: {
                    amount: 1,
                    upTo: true,
                  },
                  filters: [
                    {
                      filter: "state",
                      value: "rested",
                    },
                  ],
                },
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04IsshoOp14021021I18n,
};
