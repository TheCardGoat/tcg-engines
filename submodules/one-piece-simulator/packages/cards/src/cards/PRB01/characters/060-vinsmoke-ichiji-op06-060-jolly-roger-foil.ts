import type { CharacterCard } from "@tcg/op-types";
import { prb01VinsmokeIchijiOp06060JollyRogerFoil060I18n } from "./060-vinsmoke-ichiji-op06-060-jolly-roger-foil.i18n.ts";

export const prb01VinsmokeIchijiOp06060JollyRogerFoil060: CharacterCard = {
  id: "OP06-060",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "PRB01",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-060_p3.jpg",
      imageId: "OP06-060_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-060_r1.png",
      imageId: "OP06-060_r1",
    },
  ],
  effect:
    "[Activate:Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.)You may trash this Character: If your Leader has the [GERMA 66] type, play up to 1 [Vinsmoke Ichiji] with a cost of 7 from your hand or trash.",
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
                value: 7,
              },
              {
                filter: "name",
                value: "Vinsmoke Ichiji",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01VinsmokeIchijiOp06060JollyRogerFoil060I18n,
};
