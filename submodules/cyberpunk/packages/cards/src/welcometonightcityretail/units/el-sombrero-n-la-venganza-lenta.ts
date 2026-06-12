import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailElSombreroNLaVenganzaLenta = {
  id: "c688ca08-b3b7-441d-b161-78b9a63a8a9e",
  externalId: "cb-el-sombrero-n-la-venganza-lenta",
  slug: "el-sombrero-n-la-venganza-lenta",
  name: "El Sombrerón — La Venganza Lenta",
  subname: null,
  displayName: "El Sombrerón — La Venganza Lenta",
  rulesText:
    "[ATTACK] You may pay 2 €$. If you do, this Unit gains power equal to a friendly max Gig this turn.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "red",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "009",
  printings: [
    {
      id: "94180516-28a6-4f5c-b79e-de38a95ed47b",
      collectorNumber: "009",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/009.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/94180516-28a6-4f5c-b79e-de38a95ed47b/render-mpvm6o5y.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Rafael de Latorre & Clonerh",
    },
    {
      id: "c180e174-f1b6-4b9c-b2c8-db0551ae49d2",
      collectorNumber: "β009",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b009.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/c180e174-f1b6-4b9c-b2c8-db0551ae49d2/render-mpv4qvsv.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Rafael de Latorre & Clonerh",
    },
  ],
  selectedPrintingId: "94180516-28a6-4f5c-b79e-de38a95ed47b",
  artist: "Rafael de Latorre & Clonerh",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/009.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/94180516-28a6-4f5c-b79e-de38a95ed47b/render-mpvm6o5y.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["attack"],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "ATTACK You may pay 2 €$. If you do, this Unit gains power equal to a friendly max Gig this turn.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      costs: [
        {
          cost: "payEddies",
          amount: 2,
        },
      ],
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "self",
          },
          value: {
            type: "maxGigValue",
            controller: "friendly",
          },
          duration: "turn",
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
