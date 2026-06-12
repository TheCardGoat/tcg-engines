import type { CharacterCard } from "@tcg/op-types";
import { prb01VinsmokeNijiOp06064JollyRogerFoil064I18n } from "./064-vinsmoke-niji-op06-064-jolly-roger-foil.i18n.ts";

export const prb01VinsmokeNijiOp06064JollyRogerFoil064: CharacterCard = {
  id: "OP06-064",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "PRB01",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-064_p3.jpg",
      imageId: "OP06-064_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-064_r1.png",
      imageId: "OP06-064_r1",
    },
  ],
  effect:
    "[Activate:Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.)You may trash this Character: If your Leader has the [GERMA 66] type, play up to 1 [Vinsmoke Niji] with a cost of 5 from your hand or trash.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "GERMA 66",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 5,
              },
              {
                filter: "name",
                value: "Vinsmoke Niji",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01VinsmokeNijiOp06064JollyRogerFoil064I18n,
};
