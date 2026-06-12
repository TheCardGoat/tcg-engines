import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRiverWardDetectiveOnTheHunt = {
  id: "e64e2978-695b-4fc5-b17b-62c710a11c47",
  externalId: "cb-river-ward-detective-on-the-hunt",
  slug: "river-ward-detective-on-the-hunt",
  name: "River Ward — Detective on the Hunt",
  subname: null,
  displayName: "River Ward — Detective on the Hunt",
  rulesText:
    "[QUICK] [Spend Icon:] Play a Gear with cost 2 or less from your hand for free.\nWhen a friendly equipped Unit is defeated, search the top 2 cards of your deck and trash 1.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["NCPD"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "039",
  printings: [
    {
      id: "b3895f75-e147-49b0-a6d8-6fb35b356b2e",
      collectorNumber: "039",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/039.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/b3895f75-e147-49b0-a6d8-6fb35b356b2e/render-mpvmn1j1.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
    {
      id: "b217ae88-52a6-44b3-b021-964db4534dbd",
      collectorNumber: "β039",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b039.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/b217ae88-52a6-44b3-b021-964db4534dbd/render-mpu63yha.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
  ],
  selectedPrintingId: "b3895f75-e147-49b0-a6d8-6fb35b356b2e",
  artist: "Daniel Valaisis",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/039.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/b3895f75-e147-49b0-a6d8-6fb35b356b2e/render-mpvmn1j1.webp",
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
      text: "SPEND Play a Gear with cost 2 or less from your hand for free.",
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
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "attachCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["hand"],
            cardTypes: ["gear"],
            maxCost: 2,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          attachTo: {
            selector: "bound",
            id: "selectedUnit",
          },
          free: true,
        },
      ],
    },
    {
      kind: "triggered",
      text: "When a friendly equipped Unit is defeated, search the top 2 cards of your deck and trash 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardDefeated",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            cardTypes: ["unit"],
            hasAttachedCards: true,
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 2,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
          },
          select: {
            kind: "exact",
            amount: 1,
          },
          reveal: false,
          destination: "trash",
          remainder: {
            zone: "deckBottom",
          },
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
