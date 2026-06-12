import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const boxTopperRetailYorinobuArasakaEmbracingDestruction = {
  id: "31fa5825-946a-4ca2-afa8-8f07b9898d6a",
  externalId: "cb-yorinobu-arasaka-embracing-destruction",
  slug: "yorinobu-arasaka-embracing-destruction",
  name: "Yorinobu Arasaka — Embracing Destruction",
  subname: null,
  displayName: "Yorinobu Arasaka — Embracing Destruction",
  rulesText:
    "The first time a friendly ARASAKA Unit attacks each turn, draw 1. Then, if you have less than 20 ☆ (Street Cred), discard 1.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "red",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "001",
  printings: [
    {
      id: "dc7bb3cf-1005-4584-ad7a-447f0ccf07bf",
      collectorNumber: "001",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/001.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/dc7bb3cf-1005-4584-ad7a-447f0ccf07bf/render-mpvt1j4x.webp",
      set: {
        code: "boxtoppersretail",
        name: "Box Toppers — Retail",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "f70b75b5-aa2f-4c2d-b8c3-01fcb2a670ec",
      collectorNumber: "001",
      imageUrl:
        "https://r2.tcg.online/public/cyberpunk/cards/embracingpowerretailstarterdeck/001.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/f70b75b5-aa2f-4c2d-b8c3-01fcb2a670ec/render-mpwbzegh.webp",
      set: {
        code: "embracingpowerretailstarterdeck",
        name: "Embracing Power — Retail Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "ADIA",
    },
    {
      id: "12337d92-713c-4c7c-8a16-595a7b4717f1",
      collectorNumber: "β001",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersbeta/b001.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/12337d92-713c-4c7c-8a16-595a7b4717f1/render-mpvsti09.webp",
      set: {
        code: "boxtoppersbeta",
        name: "Box Toppers — Beta",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "362bef23-c935-4729-a13b-dc3bc646d9b3",
      collectorNumber: "β001",
      imageUrl:
        "https://r2.tcg.online/public/cyberpunk/cards/embracingpowerbetastarterdeck/b001.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/362bef23-c935-4729-a13b-dc3bc646d9b3/render-mpwbnlmb.webp",
      set: {
        code: "embracingpowerbetastarterdeck",
        name: "Embracing Power — Beta Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "ADIA",
    },
  ],
  selectedPrintingId: "dc7bb3cf-1005-4584-ad7a-447f0ccf07bf",
  artist: "ADIA",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/001.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/dc7bb3cf-1005-4584-ad7a-447f0ccf07bf/render-mpvt1j4x.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "The first time a friendly ARASAKA Unit attacks each turn, draw 1. Then, if you have less than 20 ☆ (Street Cred), discard 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardAttacks",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            classifications: ["Arasaka"],
          },
        },
      },
      source: {
        selector: "self",
      },
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
        },
        {
          effect: "discardFromHand",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "streetCred",
              controller: "friendly",
              comparison: "lt",
              value: 20,
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
