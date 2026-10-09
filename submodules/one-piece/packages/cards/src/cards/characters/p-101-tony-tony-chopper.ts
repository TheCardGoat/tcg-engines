import type { CharacterCard } from "@tcg/op-types";
import { pTonyTonyChopper101I18n } from "./p-101-tony-tony-chopper.i18n.ts";
export const pTonyTonyChopper101: CharacterCard = {
  id: "P-101",
  canonicalId: "P-101",
  slug: "tony-tony-chopper/p-101",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "P-101",
      artId: "P-101",
      setCode: "P",
      collectorNumber: "101",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-101.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Give up to 1 rested DON!! card to your Leader.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: pTonyTonyChopper101I18n,
};
