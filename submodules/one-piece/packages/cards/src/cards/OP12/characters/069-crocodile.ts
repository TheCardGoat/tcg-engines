import type { CharacterCard } from "@tcg/op-types";
import { op12Crocodile069I18n } from "./069-crocodile.i18n.ts";

export const op12Crocodile069: CharacterCard = {
  id: "OP12-069",
  canonicalId: "OP12-069",
  slug: "crocodile/op12-069",
  name: "Crocodile",
  printings: [
    {
      id: "OP12-069",
      artId: "OP12-069",
      setCode: "OP12",
      collectorNumber: "069",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-069_uufcH21.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 6,
  power: 8000,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] DON!! 1: If your Leader's type includes \"Baroque Works\", up to 1 of your Leader or Character cards gains +2000 power during this battle.",
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
            condition: {
              condition: "leaderTrait",
              trait: "Baroque Works",
              match: "includes",
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12Crocodile069I18n,
};
