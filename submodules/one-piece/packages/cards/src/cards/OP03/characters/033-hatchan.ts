import type { CharacterCard } from "@tcg/op-types";
import { op03Hatchan033I18n } from "./033-hatchan.i18n.ts";

export const op03Hatchan033: CharacterCard = {
  id: "OP03-033",
  canonicalId: "OP03-033",
  slug: "hatchan/op03-033",
  name: "Hatchan",
  printings: [
    {
      id: "OP03-033",
      artId: "OP03-033",
      setCode: "OP03",
      collectorNumber: "033",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-033.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP03",
  cost: 4,
  power: 4000,
  counter: 2000,
  trigger: "If your Leader has the {East Blue} type, play this card.",
  traits: ["Fish-Man Arlong Pirates East Blue"],
  attribute: "slash",
  effect: "[Trigger] If your Leader has the {East Blue} type, play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "East Blue",
            match: "includes",
          },
        ],
        actions: [{ action: "playThisCard" }],
      },
    ],
  },
  i18n: op03Hatchan033I18n,
};
