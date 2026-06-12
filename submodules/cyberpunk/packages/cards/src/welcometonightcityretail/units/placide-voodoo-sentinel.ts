import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailPlacideVoodooSentinel = {
  id: "783a9082-b79c-4b45-bf66-48728ff9b92d",
  externalId: "cb-placide-voodoo-sentinel",
  slug: "placide-voodoo-sentinel",
  name: "Placide — Voodoo Sentinel",
  subname: null,
  displayName: "Placide — Voodoo Sentinel",
  rulesText: "[PLAY] [ATTACK] You may discard 1 Program. If you do, bottom-deck a rival Unit.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "blue",
  classifications: ["Ganger", "Netrunner", "Voodoo Boys"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "123",
  printings: [
    {
      id: "81c55c1f-362e-4ffd-8f9b-4162b298dbd5",
      collectorNumber: "123",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/123.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/81c55c1f-362e-4ffd-8f9b-4162b298dbd5/render-mpvm972b.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Mooncolony",
    },
    {
      id: "0ff059f8-90c3-47ef-ba3b-cd380f30f14e",
      collectorNumber: "β123",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b123.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/0ff059f8-90c3-47ef-ba3b-cd380f30f14e/render-mpv4rjph.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Mooncolony",
    },
  ],
  selectedPrintingId: "81c55c1f-362e-4ffd-8f9b-4162b298dbd5",
  artist: "Mooncolony",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/123.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/81c55c1f-362e-4ffd-8f9b-4162b298dbd5/render-mpvm972b.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play", "attack"],
  keywords: [],
  type: "unit",
  cost: 8,
  power: 10,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY ATTACK You may discard 1 Program. If you do, bottom-deck a rival Unit.",
      trigger: {
        trigger: "play",
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
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["program"],
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "moveCard",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                selection: {
                  mode: "choose",
                  min: 1,
                  max: 1,
                },
              },
              destination: "deckBottom",
            },
          ],
        },
      ],
    },
    {
      kind: "triggered",
      text: "PLAY ATTACK You may discard 1 Program. If you do, bottom-deck a rival Unit.",
      trigger: {
        trigger: "attack",
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
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["program"],
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "moveCard",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                selection: {
                  mode: "choose",
                  min: 1,
                  max: 1,
                },
              },
              destination: "deckBottom",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
