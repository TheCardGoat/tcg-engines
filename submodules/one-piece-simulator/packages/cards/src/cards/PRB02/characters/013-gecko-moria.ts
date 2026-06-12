import type { CharacterCard } from "@tcg/op-types";
import { prb02GeckoMoria013I18n } from "./013-gecko-moria.i18n.ts";

export const prb02GeckoMoria013: CharacterCard = {
  id: "PRB02-013",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "PRB02",
  cost: 6,
  power: 7000,
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-013_p1.jpg",
      imageId: "PRB02-013_p1",
    },
  ],
  effect:
    '[On Play] If your Leader has the "Thriller Bark Pirates" type, play up to 1 Character card with a cost of 4 or less from your trash rested. Then, give up to 1 rested DON!! card to your Leader or 1 of your Characters.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Thriller Bark Pirates",
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
                value: 4,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: prb02GeckoMoria013I18n,
};
