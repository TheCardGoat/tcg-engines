import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MsAllSunday084I18n } from "./084-ms-all-sunday.i18n.ts";

export const op14eb04MsAllSunday084: CharacterCard = {
  id: "OP14-084",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 7,
  power: 8000,
  traits: ["Baroque Works"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-084_p1_RTfuoka.jpg",
      imageId: "OP14-084_p1",
    },
  ],
  effect:
    '[On Play] If your Leader\'s type includes "Baroque Works", play up to 1 Character card with a type including "Baroque Works" and a cost of 4 or less and up to 1 Character card with a type including "Baroque Works" and a cost of 1 from your trash.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
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
          },
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
          },
        ],
      },
    ],
  },
  i18n: op14eb04MsAllSunday084I18n,
};
