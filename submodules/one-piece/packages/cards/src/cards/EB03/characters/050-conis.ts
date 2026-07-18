import type { CharacterCard } from "@tcg/op-types";
import { eb03Conis050I18n } from "./050-conis.i18n.ts";

export const eb03Conis050: CharacterCard = {
  id: "EB03-050",
  canonicalId: "EB03-050",
  slug: "conis/eb03-050",
  name: "Conis",
  printings: [
    {
      id: "EB03-050",
      artId: "EB03-050",
      setCode: "EB03",
      collectorNumber: "050",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-050_sOGpx3U.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB03",
  cost: 2,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "wisdom",
  effect:
    "[On Play] Up to 1 of your {Sky Island} type Characters gains [Double Attack] during this turn.\n(This card deals 2 damage.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Sky Island",
                  match: "includes",
                },
              ],
            },
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: eb03Conis050I18n,
};
