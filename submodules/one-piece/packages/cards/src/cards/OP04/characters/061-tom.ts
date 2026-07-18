import type { CharacterCard } from "@tcg/op-types";
import { op04Tom061I18n } from "./061-tom.i18n.ts";

export const op04Tom061: CharacterCard = {
  id: "OP04-061",
  canonicalId: "OP04-061",
  slug: "tom/op04-061",
  name: "Tom",
  printings: [
    {
      id: "OP04-061",
      artId: "OP04-061",
      setCode: "OP04",
      collectorNumber: "061",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-061.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Fish-Man", "Water Seven"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may trash this Character: If your Leader has the [Water Seven] type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
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
            condition: {
              condition: "leaderTrait",
              trait: "Water Seven",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Tom061I18n,
};
