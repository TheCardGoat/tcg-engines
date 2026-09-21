import type { CharacterCard } from "@tcg/op-types";
import { op14eb04BoaHancockOp14112112I18n } from "./op14-112-boa-hancock.i18n.ts";

export const op14eb04BoaHancockOp14112112: CharacterCard = {
  id: "OP14-112",
  canonicalId: "OP14-112",
  slug: "boa-hancock/op14-112",
  name: "Boa Hancock",
  printings: [
    {
      id: "OP14-112",
      artId: "OP14-112",
      setCode: "OP14",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-112_7Isffre.jpg",
      label: "Boa Hancock - OP14-112",
    },
    {
      id: "OP14-112_p2",
      artId: "OP14-112_p2",
      setCode: "OP14",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-112_p2.jpg",
      label: "Boa Hancock - OP14-112 (SP)",
    },
    {
      id: "OP14-112_p1",
      artId: "OP14-112_p1",
      setCode: "OP14",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-112_p1_FuOrRQo.jpg",
      label: "Boa Hancock - OP14-112 (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP14",
  cost: 9,
  power: 10000,
  trigger: "Play up to 1 Character card with 6000 power or less and a [Trigger] from your hand.",
  traits: ["The Seven Warlords of the Sea", "Kuja Pirates"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the {The Seven Warlords of the Sea} type, add up to 1 card from the top of your deck to the top of your Life cards. Then, add up to 1 card from the top of your opponent's Life cards to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "The Seven Warlords of the Sea",
            match: "includes",
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
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "hand",
          },
        ],
      },
      {
        trigger: "trigger",
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
                filter: "hasTrigger",
                value: true,
              },
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
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
  i18n: op14eb04BoaHancockOp14112112I18n,
};
