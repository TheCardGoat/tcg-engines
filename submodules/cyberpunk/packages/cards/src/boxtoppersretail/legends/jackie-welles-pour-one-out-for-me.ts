import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const boxTopperRetailJackieWellesPourOneOutForMe = {
  id: "40502c1f-78a2-426a-a706-c60ebd4b31e3",
  externalId: "cb-jackie-welles-pour-one-out-for-me",
  slug: "jackie-welles-pour-one-out-for-me",
  name: "Jackie Welles — Pour One Out For Me",
  subname: null,
  displayName: "Jackie Welles — Pour One Out For Me",
  rulesText:
    "The first time you play a Blue Unit or Blue Gear each turn, you may decrease a friendly Gig by up to 2. If it becomes a min Gig, draw 1.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "blue",
  classifications: ["Merc"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "005",
  printings: [
    {
      id: "e4e17d32-3ec4-4c74-927c-fd0911b86e72",
      collectorNumber: "005",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/005.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/e4e17d32-3ec4-4c74-927c-fd0911b86e72/render-mpvt2kdp.webp",
      set: {
        code: "boxtoppersretail",
        name: "Box Toppers — Retail",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "a33d3324-fe48-4a9f-80a8-8545a0a4727f",
      collectorNumber: "011",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/011.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/a33d3324-fe48-4a9f-80a8-8545a0a4727f/render-mpwcl76z.webp",
      set: {
        code: "theheistretailstarterdeck",
        name: "The Heist — Retail Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Envar",
    },
    {
      id: "328cd3e4-4177-4d6a-86c0-00d1a5a12b38",
      collectorNumber: "β005",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersbeta/b005.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/328cd3e4-4177-4d6a-86c0-00d1a5a12b38/render-mpvsu9ju.webp",
      set: {
        code: "boxtoppersbeta",
        name: "Box Toppers — Beta",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "a0ef9536-ad3b-47f6-8c2a-171aa3b8b181",
      collectorNumber: "β011",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/theheistbetastarterdeck/b011.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/a0ef9536-ad3b-47f6-8c2a-171aa3b8b181/render-mpwcevbi.webp",
      set: {
        code: "theheistbetastarterdeck",
        name: "The Heist — Beta Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Envar",
    },
  ],
  selectedPrintingId: "e4e17d32-3ec4-4c74-927c-fd0911b86e72",
  artist: "Envar Studio",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/005.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/e4e17d32-3ec4-4c74-927c-fd0911b86e72/render-mpvt2kdp.webp",
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
      text: "The first time you play a Blue Unit or Blue Gear each turn, you may decrease a friendly Gig by up to 2. If it becomes a min Gig, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardPlayed",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            cardTypes: ["unit", "gear"],
            colors: ["blue"],
          },
        },
      },
      source: {
        selector: "self",
      },
      limits: ["firstTimeEachTurn"],
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            controller: "friendly",
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
          maxAmount: 2,
          direction: "decrease",
          chooseUpTo: true,
          optional: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "targetValue",
              target: {
                selector: "bound",
                id: "selectedGig",
              },
              property: "gigValue",
              comparison: "eq",
              value: 1,
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
