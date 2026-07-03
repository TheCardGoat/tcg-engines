import type { CharacterCard } from "@tcg/op-types";
import { eb02Klabautermann033I18n } from "./033-klabautermann.i18n.ts";

export const eb02Klabautermann033: CharacterCard = {
  id: "EB02-033",
  canonicalId: "EB02-033",
  slug: "klabautermann",
  name: "Klabautermann",
  printings: [
    {
      id: "EB02-033",
      artId: "EB02-033",
      setCode: "EB02",
      collectorNumber: "033",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-033.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB02",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Sprite"],
  attribute: "wisdom",
  effect: "If you have [Merry Go] on your field, this Character gains [Blocker].",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "stage",
            filters: [
              {
                filter: "name",
                value: "Merry Go",
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb02Klabautermann033I18n,
};
