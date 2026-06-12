import type { CharacterCard } from "@tcg/op-types";
import { op11CharlotteKatakuri067I18n } from "./067-charlotte-katakuri.i18n.ts";

export const op11CharlotteKatakuri067: CharacterCard = {
  id: "OP11-067",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP11",
  cost: 8,
  power: 8000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-067_p1.jpg",
      imageId: "OP11-067_p1",
    },
  ],
  effect:
    '[Blocker]\n[End of Your Turn] Set up to 2 of your "Big Mom Pirates" type Characters with a cost of 3 or more as active. Then, add up to 1 DON!! card from your DON!! deck and rest it.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Big Mom Pirates",
                },
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 3,
                },
              ],
            },
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op11CharlotteKatakuri067I18n,
};
