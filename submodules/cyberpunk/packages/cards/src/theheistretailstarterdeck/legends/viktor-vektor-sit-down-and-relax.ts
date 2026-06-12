import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const theHeistRetailStarterDeckViktorVektorSitDownAndRelax = {
  id: "f090dc44-d7f0-4aec-a19e-9213155a6611",
  externalId: "cb-viktor-vektor-sit-down-and-relax",
  slug: "viktor-vektor-sit-down-and-relax",
  name: "Viktor Vektor — Sit Down and Relax",
  subname: null,
  displayName: "Viktor Vektor — Sit Down and Relax",
  rulesText:
    "[CALL] Search the top 5 cards of your deck. Reveal up to 2 Gears with cost 2 or less and add them to your hand. Bottom-deck the rest in a random order.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Merc", "Ripperdoc"],
  set: {
    code: "theheistretailstarterdeck",
    name: "The Heist — Retail Starter Deck",
  },
  printNumber: "001",
  printings: [
    {
      id: "7d539173-4022-402e-a9f4-100338935fd2",
      collectorNumber: "001",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/001.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/7d539173-4022-402e-a9f4-100338935fd2/render-mpwcnsje.webp",
      set: {
        code: "theheistretailstarterdeck",
        name: "The Heist — Retail Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Envar",
    },
    {
      id: "c9ceb0e7-c803-45d1-8da1-8c85c3b2e7e8",
      collectorNumber: "002",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/002.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/c9ceb0e7-c803-45d1-8da1-8c85c3b2e7e8/render-mpvt1hjv.webp",
      set: {
        code: "boxtoppersretail",
        name: "Box Toppers — Retail",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "56a13bb3-7e1d-4846-ac79-9163f33c0143",
      collectorNumber: "β001",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/theheistbetastarterdeck/b001.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/56a13bb3-7e1d-4846-ac79-9163f33c0143/render-mpwcftz8.webp",
      set: {
        code: "theheistbetastarterdeck",
        name: "The Heist — Beta Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Envar",
    },
    {
      id: "a33c6299-f1ee-404e-9197-cad5f7e84fce",
      collectorNumber: "β002",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersbeta/b002.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/a33c6299-f1ee-404e-9197-cad5f7e84fce/render-mpvsu7dk.webp",
      set: {
        code: "boxtoppersbeta",
        name: "Box Toppers — Beta",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
  ],
  selectedPrintingId: "7d539173-4022-402e-a9f4-100338935fd2",
  artist: "Envar",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/001.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/7d539173-4022-402e-a9f4-100338935fd2/render-mpwcnsje.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: [],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "CALL Search the top 5 cards of your deck. Reveal up to 2 Gears with cost 2 or less and add them to your hand. Bottom-deck the rest in a random order.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 5,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
            cardTypes: ["gear"],
            maxCost: 2,
          },
          select: {
            kind: "upTo",
            max: 2,
          },
          reveal: true,
          destination: "hand",
          remainder: {
            zone: "deckBottom",
            order: "random",
          },
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
