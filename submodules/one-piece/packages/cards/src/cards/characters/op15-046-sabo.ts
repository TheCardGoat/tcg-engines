import type { CharacterCard } from "@tcg/op-types";
import { op15Sabo046I18n } from "./op15-046-sabo.i18n.ts";

export const op15Sabo046: CharacterCard = {
  id: "OP15-046",
  canonicalId: "OP15-046",
  slug: "sabo/op15-046",
  name: "Sabo",
  printings: [
    {
      id: "OP15-046",
      artId: "OP15-046",
      setCode: "OP15",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-046_hRbLfA6.jpg",
    },
    {
      id: "OP15-046_p1",
      artId: "OP15-046_p1",
      setCode: "OP15",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-046_p1_Zpqnbqv.jpg",
      label: "Sabo (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP15",
  cost: 7,
  power: 9000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  effect:
    "[Blocker]\n[On Play] If your Leader has the {Dressrosa} type, activate up to 1 {Dressrosa} type Event from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Dressrosa",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "activateEvent",
            effectTrigger: "main",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Dressrosa",
                  match: "includes",
                },
                {
                  filter: "cardCategory",
                  value: "event",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op15Sabo046I18n,
};
