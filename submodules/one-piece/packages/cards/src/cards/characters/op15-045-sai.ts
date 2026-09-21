import type { CharacterCard } from "@tcg/op-types";
import { op15Sai045I18n } from "./op15-045-sai.i18n.ts";

export const op15Sai045: CharacterCard = {
  id: "OP15-045",
  canonicalId: "OP15-045",
  slug: "sai/op15-045",
  name: "Sai",
  printings: [
    {
      id: "OP15-045",
      artId: "OP15-045",
      setCode: "OP15",
      collectorNumber: "045",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-045_aPNUUlO.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP15",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Happosui Army Dressrosa"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] You may trash 1 Event from your hand: Draw 2 cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op15Sai045I18n,
};
