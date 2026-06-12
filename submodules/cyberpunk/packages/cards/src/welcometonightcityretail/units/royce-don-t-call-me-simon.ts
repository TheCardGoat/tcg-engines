import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRoyceDonTCallMeSimon = {
  id: "9e465b11-9743-4275-a71d-d701b059eef0",
  externalId: "cb-royce-don-t-call-me-simon",
  slug: "royce-don-t-call-me-simon",
  name: "Royce — Don't Call Me Simon",
  subname: null,
  displayName: "Royce — Don't Call Me Simon",
  rulesText:
    "[PLAY] Defeat a rival Unit with power 2 or less. If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 3 or less instead.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "red",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "016",
  printings: [
    {
      id: "b749ce16-1b44-47d8-bce4-4fd373007a5c",
      collectorNumber: "016",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/016.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/b749ce16-1b44-47d8-bce4-4fd373007a5c/render-mpvm2yf1.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "Mooncolony",
    },
    {
      id: "a4276d5e-cdf1-42cb-a6c3-8722d8c7c595",
      collectorNumber: "β016",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b016.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/a4276d5e-cdf1-42cb-a6c3-8722d8c7c595/render-mpv4n2r4.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "Mooncolony",
    },
  ],
  selectedPrintingId: "b749ce16-1b44-47d8-bce4-4fd373007a5c",
  artist: "Mooncolony",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/016.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/b749ce16-1b44-47d8-bce4-4fd373007a5c/render-mpvm2yf1.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Defeat a rival Unit with power 2 or less. If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 3 or less instead.",
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
            maxPower: 3,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "gt",
              other: "rival",
            },
          ],
        },
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 2,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "lte",
              other: "rival",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
