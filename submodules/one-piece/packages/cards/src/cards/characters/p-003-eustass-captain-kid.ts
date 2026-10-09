import type { CharacterCard } from "@tcg/op-types";
import { pEustassCaptainKid003I18n } from "./p-003-eustass-captain-kid.i18n.ts";
export const pEustassCaptainKid003: CharacterCard = {
  id: "P-003",
  canonicalId: "P-003",
  slug: "eustass-captain-kid/p-003",
  name: 'Eustass"Captain"Kid',
  printings: [
    {
      id: "P-003",
      artId: "P-003",
      setCode: "P",
      collectorNumber: "003",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-003.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Supernovas", "Kid Pirates"],
  attribute: "special",
  effect: "[DON!! x2] This Character gains [Double Attack]. (This card deals 2 damage.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
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
            keyword: "doubleAttack",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pEustassCaptainKid003I18n,
};
