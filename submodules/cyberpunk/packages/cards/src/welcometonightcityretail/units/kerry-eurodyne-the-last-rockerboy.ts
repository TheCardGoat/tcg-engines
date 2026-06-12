import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailKerryEurodyneTheLastRockerboy = {
  id: "5c4d4058-9185-4305-9e8f-7eca41cf6674",
  externalId: "cb-kerry-eurodyne-the-last-rockerboy",
  slug: "kerry-eurodyne-the-last-rockerboy",
  name: "Kerry Eurodyne — The Last Rockerboy",
  subname: null,
  displayName: "Kerry Eurodyne — The Last Rockerboy",
  rulesText: "[Spend Icon:] If you control a Gig with 8+ value, draw 2.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "red",
  classifications: ["Rocker", "Samurai"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "012",
  printings: [
    {
      id: "c26c7db6-f540-4073-ab33-b09335631764",
      collectorNumber: "012",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/012.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/c26c7db6-f540-4073-ab33-b09335631764/render-mpvm47z6.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "Bogna Gawrońska",
    },
    {
      id: "1a986e5a-fe97-408c-81e9-b675c64bdcf9",
      collectorNumber: "β012",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b012.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/1a986e5a-fe97-408c-81e9-b675c64bdcf9/render-mpv4n5ek.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "Bogna Gawrońska",
    },
  ],
  selectedPrintingId: "c26c7db6-f540-4073-ab33-b09335631764",
  artist: "Bogna Gawrońska",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/012.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/c26c7db6-f540-4073-ab33-b09335631764/render-mpvm47z6.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 4,
  power: 5,
  abilities: [
    {
      kind: "triggered",
      text: "SPEND If you control a Gig with 8+ value, draw 2.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "gigWithEightOrMore",
          target: {
            selector: "gig",
            controller: "friendly",
            minValue: 8,
          },
        },
      ],
      costs: [
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
