import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailCaliberTotentanzSTopDog = {
  id: "0273f402-94fb-4b59-90ec-a1057c2d1284",
  externalId: "cb-caliber-totentanz-s-top-dog",
  slug: "caliber-totentanz-s-top-dog",
  name: "Caliber — Totentanz's Top Dog",
  subname: null,
  displayName: "Caliber — Totentanz's Top Dog",
  rulesText:
    "[PLAY] Defeat a rival Unit with cost 2 or less.\n[DEFEATED] A Rival discards 1. If the card's cost equals the value of a friendly Gig, that Rival discards 1 more.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "044",
  printings: [
    {
      id: "4b5dc479-0db1-46dd-859f-e7dc34d50f03",
      collectorNumber: "044",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/044.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/4b5dc479-0db1-46dd-859f-e7dc34d50f03/render-mpvm8ira.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "André Lima Araújo & Chris O'Halloran",
    },
    {
      id: "20cd09ad-b0c6-4ffe-9036-04ff24d8fe59",
      collectorNumber: "β044",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b044.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/20cd09ad-b0c6-4ffe-9036-04ff24d8fe59/render-mpv4ralp.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "André Lima Araújo & Chris O'Halloran",
    },
  ],
  selectedPrintingId: "4b5dc479-0db1-46dd-859f-e7dc34d50f03",
  artist: "André Lima Araújo & Chris O'Halloran",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/044.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/4b5dc479-0db1-46dd-859f-e7dc34d50f03/render-mpvm8ira.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 5,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Defeat a rival Unit with cost 2 or less.",
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
            maxCost: 2,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
    },
    {
      kind: "triggered",
      text: "DEFEATED A Rival discards 1. If the card's cost equals the value of a friendly Gig, that Rival discards 1 more.",
      trigger: {
        trigger: "defeated",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
        },
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
          conditions: [
            {
              condition: "costMatchesGig",
              target: {
                selector: "context",
                key: "discardedCards",
              },
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
