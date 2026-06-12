import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailGoroTakemuraVengefulBodyguard = {
  id: "424c9c0f-cc01-40ec-8404-75957985c7f8",
  externalId: "cb-goro-takemura-vengeful-bodyguard",
  slug: "goro-takemura-vengeful-bodyguard",
  name: "Goro Takemura — Vengeful Bodyguard",
  subname: null,
  displayName: "Goro Takemura — Vengeful Bodyguard",
  rulesText:
    "[QUICK] 1 €$, [Spend Icon:] Give a friendly Unit with cost 4 or less [BLOCKER] this turn. If you control a value-pair of Gigs, also give it +1 power this turn.\nWhen a friendly Unit uses [BLOCKER], you may discard 1. If you do, draw 1.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "071",
  printings: [
    {
      id: "0f6e52f0-511f-4ae9-a380-5e718b26e58a",
      collectorNumber: "071",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/071.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/0f6e52f0-511f-4ae9-a380-5e718b26e58a/render-mpvmmf2e.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
    {
      id: "5f3c905b-0834-46a2-be33-ea46e59d4c7f",
      collectorNumber: "β071",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b071.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/5f3c905b-0834-46a2-be33-ea46e59d4c7f/render-mpu64p91.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
  ],
  selectedPrintingId: "0f6e52f0-511f-4ae9-a380-5e718b26e58a",
  artist: "Daniel Valaisis",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/071.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/0f6e52f0-511f-4ae9-a380-5e718b26e58a/render-mpvmmf2e.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["quick"],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "keyword",
      text: "QUICK",
      keyword: "quick",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "1 €$, SPEND Give a friendly Unit with cost 4 or less BLOCKER this turn. If you control a value-pair of Gigs, also give it +1 power this turn.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedUnit",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 4,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
      costs: [
        {
          cost: "payEddies",
          amount: 1,
        },
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          rule: "blocker",
          duration: "turn",
        },
        {
          effect: "modifyPower",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          value: 1,
          duration: "turn",
          conditions: [
            {
              condition: "hasGigPair",
              controller: "friendly",
            },
          ],
        },
      ],
    },
    {
      kind: "triggered",
      text: "When a friendly Unit uses BLOCKER, you may discard 1. If you do, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "blockerActivated",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "discardFromHand",
            player: "friendly",
            amount: 1,
            optional: true,
          },
          ifEffects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
