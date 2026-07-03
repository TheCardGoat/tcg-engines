import type { CharacterCard } from "@tcg/op-types";
import { op12MonkeyDDragon094I18n } from "./094-monkey-d-dragon.i18n.ts";

export const op12MonkeyDDragon094: CharacterCard = {
  id: "OP12-094",
  canonicalId: "OP12-094",
  slug: "monkey-d-dragon/op12-094",
  name: "Monkey.D.Dragon",
  printings: [
    {
      id: "OP12-094",
      artId: "OP12-094",
      setCode: "OP12",
      collectorNumber: "094",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-094_CvkGNXb.jpg",
    },
    {
      id: "OP12-094_p1",
      artId: "OP12-094_p1",
      setCode: "OP12",
      collectorNumber: "094",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-094_p1_6Tcw74w.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP12",
  cost: 8,
  power: 8000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-094_p1_6Tcw74w.jpg",
      imageId: "OP12-094_p1",
    },
  ],
  effect:
    '[On Play] You may place 3 "Revolutionary Army" type cards from your trash at the bottom of your deck in any order: If your Leader has the "Revolutionary Army" type, play up to 1 Character card with a cost of 6 or less from your trash.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Revolutionary Army",
          },
        ],
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
                value: 6,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12MonkeyDDragon094I18n,
};
