import type { CharacterCard } from "@tcg/op-types";
import { op07Jinbe045I18n } from "./045-jinbe.i18n.ts";

export const op07Jinbe045: CharacterCard = {
  id: "OP07-045",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man The Seven Warlords of the Sea The Sun Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-045_p1.jpg",
      imageId: "OP07-045_p1",
    },
  ],
  effect:
    "[On Play] Play up to 1 [The Seven Warlords of the Sea] type Character card with a cost of 4 or less other than [Jinbe] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Jinbe",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "The Seven Warlords of the Sea",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op07Jinbe045I18n,
};
