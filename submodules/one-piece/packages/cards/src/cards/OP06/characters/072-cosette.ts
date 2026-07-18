import type { CharacterCard } from "@tcg/op-types";
import { op06Cosette072I18n } from "./072-cosette.i18n.ts";

export const op06Cosette072: CharacterCard = {
  id: "OP06-072",
  canonicalId: "OP06-072",
  slug: "cosette",
  name: "Cosette",
  printings: [
    {
      id: "OP06-072",
      artId: "OP06-072",
      setCode: "OP06",
      collectorNumber: "072",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-072.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Kingdom of GERMA"],
  attribute: "wisdom",
  effect:
    "If your Leader has the [GERMA 66] type and the number of DON!! cards on your field is at least 2 less than the number on your opponent's field, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              { condition: "leaderTrait", trait: "GERMA 66", match: "includes" },
              { condition: "donFieldComparison", selfComparison: "lte", difference: 2 },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op06Cosette072I18n,
};
