import type { CharacterCard } from "@tcg/op-types";
import { op05Mr1DazBonez075I18n } from "./075-mr-1-daz-bonez.i18n.ts";

export const op05Mr1DazBonez075: CharacterCard = {
  id: "OP05-075",
  canonicalId: "OP05-075",
  slug: "mr-1-daz-bonez/op05-075",
  name: "Mr.1(Daz.Bonez)",
  printings: [
    {
      id: "OP05-075",
      artId: "OP05-075",
      setCode: "OP05",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-075.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect:
    "[On Your Opponent's Attack][Once Per Turn] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 [Baroque Works] type Character card with a cost of 3 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "Baroque Works",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Mr1DazBonez075I18n,
};
