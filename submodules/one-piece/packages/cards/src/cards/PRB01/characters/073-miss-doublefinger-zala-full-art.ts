import type { CharacterCard } from "@tcg/op-types";
import { prb01MissDoublefingerZalaFullArt073I18n } from "./073-miss-doublefinger-zala-full-art.i18n.ts";

export const prb01MissDoublefingerZalaFullArt073: CharacterCard = {
  id: "OP05-073",
  canonicalId: "OP05-073",
  slug: "miss-doublefinger-zala-full-art",
  name: "Miss Doublefinger(Zala) (Full Art)",
  printings: [
    {
      id: "OP05-073",
      artId: "OP05-073",
      setCode: "PRB01",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_p2_BpYvfDX.jpg",
    },
    {
      id: "OP05-073_p2",
      artId: "OP05-073_p2",
      setCode: "PRB01",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_p2.jpg",
    },
    {
      id: "OP05-073_r1",
      artId: "OP05-073_r1",
      setCode: "PRB01",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "PRB01",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_p2.jpg",
      imageId: "OP05-073_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_r1.jpg",
      imageId: "OP05-073_r1",
    },
  ],
  effect:
    "[On Play] You may trash 1 card from your hand: Add up to 1 DON!! card from your DON!! deck and rest it.[Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: prb01MissDoublefingerZalaFullArt073I18n,
};
