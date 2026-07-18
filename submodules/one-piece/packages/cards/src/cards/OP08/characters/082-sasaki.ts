import type { CharacterCard } from "@tcg/op-types";
import { op08Sasaki082I18n } from "./082-sasaki.i18n.ts";

export const op08Sasaki082: CharacterCard = {
  id: "OP08-082",
  canonicalId: "OP08-082",
  slug: "sasaki/op08-082",
  name: "Sasaki",
  printings: [
    {
      id: "OP08-082",
      artId: "OP08-082",
      setCode: "OP08",
      collectorNumber: "082",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-082.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP08",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "slash",
  effect:
    "[Activate:Main] Rest 1 of your DON!! cards and you may rest this Character: Give up to 1 of your opponent's Characters −2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Sasaki082I18n,
};
