import type { CharacterCard } from "@tcg/op-types";
import { eb04Borsalino058I18n } from "./eb04-058-borsalino.i18n.ts";

export const eb04Borsalino058: CharacterCard = {
  id: "EB04-058",
  canonicalId: "EB04-058",
  slug: "borsalino/eb04-058",
  name: "Borsalino",
  printings: [
    {
      id: "EB04-058",
      artId: "EB04-058",
      setCode: "EB04",
      collectorNumber: "058",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-058_LxNnvX2.jpg",
    },
    {
      id: "EB04-058_p1",
      artId: "EB04-058_p1",
      setCode: "EB04",
      collectorNumber: "058",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-058_p1_a850zQT.jpg",
      label: "Borsalino (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy Egghead"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If you have 2 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: eb04Borsalino058I18n,
};
