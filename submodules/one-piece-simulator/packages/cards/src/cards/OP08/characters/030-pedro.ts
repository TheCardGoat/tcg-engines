import type { CharacterCard } from "@tcg/op-types";
import { op08Pedro030I18n } from "./030-pedro.i18n.ts";

export const op08Pedro030: CharacterCard = {
  id: "OP08-030",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-030_p1.jpg",
      imageId: "OP08-030_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] Choose one: • Rest up to 1 of your opponent's DON!! cards. • K.O. up to 1 of your opponent's rested Characters with a cost of 6 or less.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "rest",
                  target: {
                    player: "opponent",
                    zones: ["costArea"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                },
              ],
              [
                {
                  action: "ko",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "state",
                        value: "rested",
                      },
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 6,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op08Pedro030I18n,
};
