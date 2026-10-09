import type { CharacterCard } from "@tcg/op-types";
import { pKaido040I18n } from "./p-040-kaido.i18n.ts";
export const pKaido040: CharacterCard = {
  id: "P-040",
  canonicalId: "P-040",
  slug: "kaido/p-040",
  name: "Kaido",
  printings: [
    {
      id: "P-040",
      artId: "P-040",
      setCode: "P",
      collectorNumber: "040",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-040.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  power: 10000,
  traits: ["The Four Emperors", "Animal Kingdom Pirates"],
  attribute: "strike",
  cost: 8,
  effect: "If your opponent has 10 DON!! cards on their field, this Character cannot be K.O.'d.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donFieldCount",
            player: "opponent",
            comparison: "eq",
            value: 10,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pKaido040I18n,
};
