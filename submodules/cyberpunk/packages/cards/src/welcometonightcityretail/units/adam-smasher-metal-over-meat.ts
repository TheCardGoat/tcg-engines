import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailAdamSmasherMetalOverMeat = {
  id: "a2ad9c2f-bfb7-473b-9408-91af142d269d",
  externalId: "cb-adam-smasher-metal-over-meat",
  slug: "adam-smasher-metal-over-meat",
  name: "Adam Smasher — Metal Over Meat",
  subname: null,
  displayName: "Adam Smasher — Metal Over Meat",
  rulesText: "[PLAY] Defeat all other Units.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "041",
  printings: [
    {
      id: "d23e322f-ad60-431d-b33e-1e8a813248ff",
      collectorNumber: "041",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/041.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/d23e322f-ad60-431d-b33e-1e8a813248ff/render-mpvlmm1k.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Dardo Studios",
    },
    {
      id: "fdb7a7c3-350e-49ea-8a9e-8477ce6c657a",
      collectorNumber: "β041",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b041.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/fdb7a7c3-350e-49ea-8a9e-8477ce6c657a/render-mpv4t0eu.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Dardo Studios",
    },
  ],
  selectedPrintingId: "d23e322f-ad60-431d-b33e-1e8a813248ff",
  artist: "Dardo Studios",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/041.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/d23e322f-ad60-431d-b33e-1e8a813248ff/render-mpvlmm1k.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: false,
  ram: 6,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 9,
  power: 15,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Defeat all other Units.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            zones: ["field"],
            cardTypes: ["unit"],
            excludeSelf: true,
          },
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
