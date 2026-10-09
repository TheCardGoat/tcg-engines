import type { CharacterCard } from "@tcg/op-types";
import { pTonyTonyChopper138I18n } from "./p-138-tony-tony-chopper.i18n.ts";
export const pTonyTonyChopper138: CharacterCard = {
  id: "P-138",
  canonicalId: "P-138",
  slug: "tony-tony-chopper/p-138",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "P-138",
      artId: "P-138",
      setCode: "P",
      collectorNumber: "138",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-138.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 4000,
  counter: 1000,
  attribute: "strike",
  traits: ["Animal", "Straw Hat Crew"],
  effect: "[Opponent's Turn] This Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pTonyTonyChopper138I18n,
};
