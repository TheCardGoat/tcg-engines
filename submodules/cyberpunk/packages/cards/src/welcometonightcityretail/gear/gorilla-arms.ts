import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailGorillaArms = {
  id: "500ae9b9-0afa-4b82-87ed-61c72583139c",
  externalId: "cb-gorilla-arms",
  slug: "gorilla-arms",
  name: "Gorilla Arms",
  subname: null,
  displayName: "Gorilla Arms",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nThe first time this Unit steals 1 or more Gigs each turn, steal a rival Gig with a value not shared by a friendly Gig.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "060",
  printings: [
    {
      id: "e1959b9e-d32d-43be-94c3-a595809e0c28",
      collectorNumber: "060",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/060.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/e1959b9e-d32d-43be-94c3-a595809e0c28/render-mpvmy1s4.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Common",
      finish: "standard",
      artist: "TOPDOG Entertainment",
    },
    {
      id: "73b6b3d3-6a7f-44ed-a267-add6ae389b5a",
      collectorNumber: "β060",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b060.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/73b6b3d3-6a7f-44ed-a267-add6ae389b5a/render-mpvjtn9o.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Common",
      finish: "standard",
      artist: "TOPDOG Entertainment",
    },
  ],
  selectedPrintingId: "e1959b9e-d32d-43be-94c3-a595809e0c28",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/060.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/e1959b9e-d32d-43be-94c3-a595809e0c28/render-mpvmy1s4.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 4,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "The first time this Unit steals 1 or more Gigs each turn, steal a rival Gig with a value not shared by a friendly Gig.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          minAmount: 1,
          source: {
            selector: "host",
          },
        },
      },
      source: {
        selector: "host",
      },
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "stealGig",
          target: {
            selector: "gig",
            controller: "rival",
            valueNotSharedBy: {
              selector: "gig",
              controller: "friendly",
              amount: "all",
            },
          },
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
