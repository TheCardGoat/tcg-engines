import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailCarnageAtTheColosseum = {
  id: "81fb66ee-b054-4f78-b0c9-7d2c9ff53435",
  externalId: "cb-carnage-at-the-colosseum",
  slug: "carnage-at-the-colosseum",
  name: "Carnage at the Colosseum",
  subname: null,
  displayName: "Carnage at the Colosseum",
  rulesText:
    "Play this Program for -1 €$ for each friendly Gig with 8+ value, to a minimum of 1 €$.\nDefeat a rival Unit with less power than a friendly Unit.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "red",
  classifications: ["Braindance", "Extreme"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "030",
  printings: [
    {
      id: "36128749-4cb1-440d-b4de-4fd463cc2f5c",
      collectorNumber: "030",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/030.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/36128749-4cb1-440d-b4de-4fd463cc2f5c/render-mpvmaxtd.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Common",
      finish: "standard",
      artist: "Matías Bergara",
    },
    {
      id: "171b21b1-90d0-4d3b-a060-740c413b7bf2",
      collectorNumber: "β030",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b030.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/171b21b1-90d0-4d3b-a060-740c413b7bf2/render-mpvk5s9p.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Common",
      finish: "standard",
      artist: "Matías Bergara",
    },
  ],
  selectedPrintingId: "36128749-4cb1-440d-b4de-4fd463cc2f5c",
  artist: "Matías Bergara",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/030.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/36128749-4cb1-440d-b4de-4fd463cc2f5c/render-mpvmaxtd.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 6,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Defeat a rival Unit with less power than a friendly Unit.",
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
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            powerLessThanAnyOf: {
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
            },
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  costModifier: {
    reducer: "perTargetCount",
    reductionPerCount: 1,
    target: {
      selector: "gig",
      controller: "friendly",
      amount: "all",
      minValue: 8,
    },
    min: 1,
  },
} satisfies StructuredCardDefinition;
