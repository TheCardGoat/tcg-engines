import type { CharacterCard } from "@tcg/op-types";
import { pKaido010I18n } from "./p-010-kaido.i18n.ts";
export const pKaido010: CharacterCard = {
  id: "P-010",
  canonicalId: "P-010",
  slug: "kaido/p-010",
  name: "Kaido",
  printings: [
    {
      id: "P-010",
      artId: "P-010",
      setCode: "P",
      collectorNumber: "010",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-010.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 8,
  power: 9000,
  traits: ["The Four Emperors", "Animal Kingdom Pirates"],
  attribute: "special",
  effect: "[End of Your Turn] Add 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: pKaido010I18n,
};
