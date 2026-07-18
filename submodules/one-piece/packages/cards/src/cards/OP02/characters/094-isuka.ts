import type { CharacterCard } from "@tcg/op-types";
import { op02Isuka094I18n } from "./094-isuka.i18n.ts";

export const op02Isuka094: CharacterCard = {
  id: "OP02-094",
  canonicalId: "OP02-094",
  slug: "isuka/op02-094",
  name: "Isuka",
  printings: [
    {
      id: "OP02-094",
      artId: "OP02-094",
      setCode: "OP02",
      collectorNumber: "094",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-094.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[DON!! x1] [Once Per Turn] When this Character battles and K.O.'s your opponent's Character, set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
        eventFilter: {
          player: "opponent",
          koCause: "battle",
          sourceSelf: true,
        },
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op02Isuka094I18n,
};
