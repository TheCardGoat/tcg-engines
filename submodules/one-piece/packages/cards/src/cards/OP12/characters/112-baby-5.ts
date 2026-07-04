import type { CharacterCard } from "@tcg/op-types";
import { op12Baby5112I18n } from "./112-baby-5.i18n.ts";

export const op12Baby5112: CharacterCard = {
  id: "OP12-112",
  canonicalId: "OP12-112",
  slug: "baby-5/op12-112",
  name: "Baby 5",
  printings: [
    {
      id: "OP12-112",
      artId: "OP12-112",
      setCode: "OP12",
      collectorNumber: "112",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-112_a2eW3y8.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 2000,
  trigger: "If your Leader is multicolored, draw 2 cards.",
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect: "[Trigger] If your Leader is multicolored, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op12Baby5112I18n,
};
