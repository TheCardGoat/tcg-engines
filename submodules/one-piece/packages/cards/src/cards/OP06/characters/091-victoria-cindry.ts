import type { CharacterCard } from "@tcg/op-types";
import { op06VictoriaCindry091I18n } from "./091-victoria-cindry.i18n.ts";

export const op06VictoriaCindry091: CharacterCard = {
  id: "OP06-091",
  canonicalId: "OP06-091",
  slug: "victoria-cindry/op06-091",
  name: "Victoria Cindry",
  printings: [
    {
      id: "OP06-091",
      artId: "OP06-091",
      setCode: "OP06",
      collectorNumber: "091",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-091.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP06",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Thriller Bark Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader has the [Thriller Bark Pirates] type, trash 5 cards from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Thriller Bark Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 5,
          },
        ],
      },
    ],
  },
  i18n: op06VictoriaCindry091I18n,
};
