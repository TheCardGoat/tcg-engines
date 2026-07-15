import type { CharacterCard } from "@tcg/op-types";
import { op06HitokiriKamazo076I18n } from "./076-hitokiri-kamazo.i18n.ts";

export const op06HitokiriKamazo076: CharacterCard = {
  id: "OP06-076",
  canonicalId: "OP06-076",
  slug: "hitokiri-kamazo/op06-076",
  name: "Hitokiri Kamazo",
  printings: [
    {
      id: "OP06-076",
      artId: "OP06-076",
      setCode: "OP06",
      collectorNumber: "076",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-076.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Kid Pirates Supernovas SMILE"],
  attribute: "slash",
  effect:
    "[Your Turn][Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
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
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06HitokiriKamazo076I18n,
};
