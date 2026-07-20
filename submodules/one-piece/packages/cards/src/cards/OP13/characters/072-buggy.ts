import type { CharacterCard } from "@tcg/op-types";
import { op13Buggy072I18n } from "./072-buggy.i18n.ts";

export const op13Buggy072: CharacterCard = {
  id: "OP13-072",
  canonicalId: "OP13-072",
  slug: "buggy/op13-072",
  name: "Buggy",
  printings: [
    {
      id: "OP13-072",
      artId: "OP13-072",
      setCode: "OP13",
      collectorNumber: "072",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-072_0FKRXGi.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP13",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Roger Pirates"],
  attribute: "slash",
  effect:
    '[On Play] If your Leader\'s type includes "Roger Pirates" and you have any DON!! cards given, add up to 1 DON!! card from your DON!! deck and rest it.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Roger Pirates",
                match: "includes",
              },
              {
                condition: "donGiven",
                player: "self",
              },
            ],
          },
        ],
        actions: [
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
  i18n: op13Buggy072I18n,
};
