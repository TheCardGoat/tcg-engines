import type { CharacterCard } from "@tcg/op-types";
import { pCrocodile004I18n } from "./p-004-crocodile.i18n.ts";
export const pCrocodile004: CharacterCard = {
  id: "P-004",
  canonicalId: "P-004",
  slug: "crocodile/p-004",
  name: "Crocodile",
  printings: [
    {
      id: "P-004",
      artId: "P-004",
      setCode: "P",
      collectorNumber: "004",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-004.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Seven Warlords of the Sea", "Baroque Works"],
  attribute: "special",
  effect:
    "[DON!! x1] This Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
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
  i18n: pCrocodile004I18n,
};
