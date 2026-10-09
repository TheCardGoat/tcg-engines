import type { CharacterCard } from "@tcg/op-types";
import { st34CharlotteKatakuri001I18n } from "./st34-001-charlotte-katakuri.i18n.ts";
export const st34CharlotteKatakuri001: CharacterCard = {
  id: "ST34-001",
  canonicalId: "ST34-001",
  slug: "charlotte-katakuri/st34-001",
  name: "Charlotte Katakuri",
  printings: [
    {
      id: "ST34-001",
      artId: "ST34-001",
      setCode: "ST34",
      collectorNumber: "001",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST34-001.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "ST34",
  cost: 5,
  power: 7000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, if your Leader has the {Big Mom Pirates} type, add up to 2 DON!! cards from your DON!! deck and rest them. [On K.O.] Play up to 1 Character card with 8000 power or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "leaderTrait",
            trait: "Big Mom Pirates",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 2,
              upTo: true,
            },
            state: "rested",
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "power",
                comparison: "lte",
                value: 8000,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: st34CharlotteKatakuri001I18n,
};
