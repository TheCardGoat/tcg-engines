import type { CharacterCard } from "@tcg/op-types";
import { op03BellMere051I18n } from "./051-bell-mere.i18n.ts";

export const op03BellMere051: CharacterCard = {
  id: "OP03-051",
  canonicalId: "OP03-051",
  slug: "bell-mere/op03-051",
  name: "Bell-mere",
  printings: [
    {
      id: "OP03-051",
      artId: "OP03-051",
      setCode: "OP03",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-051.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Former Navy East Blue"],
  attribute: "ranged",
  effect:
    "[DON!! x1] When this Character's attack deals damage to your opponent's Life, you may trash 7 cards from the top of your deck. [On K.O.] You may trash 3 cards from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "whenDealsDamage",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 7,
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
        ],
      },
    ],
  },
  i18n: op03BellMere051I18n,
};
