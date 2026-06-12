import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailZetatechFaceplate = {
  id: "eead1bba-f247-423e-a4f5-b330945887b0",
  externalId: "cb-zetatech-faceplate",
  slug: "zetatech-faceplate",
  name: "Zetatech Faceplate",
  subname: null,
  displayName: "Zetatech Faceplate",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit or Legend is spent, adjust a Gig by up to 1. Then, if you control 3 or more Gigs with different values, draw 1.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Cyberware", "Zetatech"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "064",
  printings: [
    {
      id: "79cdc9a5-d94d-4df4-9f88-aa02fb0357b3",
      collectorNumber: "064",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/064.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/79cdc9a5-d94d-4df4-9f88-aa02fb0357b3/render-mpvn0qb5.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "ADIA",
    },
    {
      id: "25077971-70cc-4524-b7cf-cd8258abc28c",
      collectorNumber: "β064",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b064.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/25077971-70cc-4524-b7cf-cd8258abc28c/render-mpvjwuu4.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "ADIA",
    },
  ],
  selectedPrintingId: "79cdc9a5-d94d-4df4-9f88-aa02fb0357b3",
  artist: "ADIA",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/064.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/79cdc9a5-d94d-4df4-9f88-aa02fb0357b3/render-mpvn0qb5.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 2,
  power: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit or Legend is spent, adjust a Gig by up to 1. Then, if you control 3 or more Gigs with different values, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardSpent",
          player: "friendly",
          target: {
            selector: "host",
          },
        },
      },
      source: {
        selector: "host",
      },
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            amount: 1,
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "adjustGig",
          target: {
            selector: "bound",
            id: "selectedGig",
          },
          maxAmount: 1,
          direction: "either",
          chooseUpTo: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "hasDistinctGigValues",
              controller: "friendly",
              minCount: 3,
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
  attachment: {
    text: "Equip to a unit or face-up legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  },
} satisfies StructuredCardDefinition;
