import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy140I18n } from "./p-140-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy140: CharacterCard = {
  id: "P-140",
  canonicalId: "P-140",
  slug: "monkey-d-luffy/p-140",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-140",
      artId: "P-140",
      setCode: "P",
      collectorNumber: "140",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-140.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 7,
  power: 8000,
  attribute: "strike",
  traits: ["Straw Hat Crew"],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
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
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy140I18n,
};
