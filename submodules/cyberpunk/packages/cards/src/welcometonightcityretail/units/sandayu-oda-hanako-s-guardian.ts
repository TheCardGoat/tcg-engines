import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSandayuOdaHanakoSGuardian = {
  id: "9611a3ba-d365-453f-89ed-c986a1948edc",
  externalId: "cb-sandayu-oda-hanako-s-guardian",
  slug: "sandayu-oda-hanako-s-guardian",
  name: "Sandayu Oda — Hanako's Guardian",
  subname: null,
  displayName: "Sandayu Oda — Hanako's Guardian",
  rulesText:
    "[PLAY] Spend a rival Unit for each friendly value-pair of Gigs.\nThis Unit can attack rival Units the turn it's played.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "green",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "088",
  printings: [
    {
      id: "f452a0ca-3204-48d5-8565-ec746f27959b",
      collectorNumber: "088",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/088.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/f452a0ca-3204-48d5-8565-ec746f27959b/render-mpvm8d1y.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "ADIA",
    },
    {
      id: "28cf40e2-f83a-47f4-9c4d-c0b5157e84e6",
      collectorNumber: "β088",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b088.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/28cf40e2-f83a-47f4-9c4d-c0b5157e84e6/render-mpv4r5wl.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "ADIA",
    },
  ],
  selectedPrintingId: "f452a0ca-3204-48d5-8565-ec746f27959b",
  artist: "ADIA",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/088.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/f452a0ca-3204-48d5-8565-ec746f27959b/render-mpvm8d1y.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 7,
  power: 8,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Spend a rival Unit for each friendly value-pair of Gigs.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "forEachFriendlyGigPair",
          effects: [
            {
              effect: "spend",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "ready",
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
    },
    {
      kind: "static",
      text: "This Unit can attack rival Units the turn it's played.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "continuous",
          conditions: [
            {
              condition: "playedThisTurn",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
