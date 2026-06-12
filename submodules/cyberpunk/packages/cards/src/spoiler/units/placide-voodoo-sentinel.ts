import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerPlacideVoodooSentinel = {
  id: "7cd71a63-f430-4e26-884c-3956f929dfef",
  externalId: "cyberpunk:placide-voodoo-sentinel",
  slug: "placide-voodoo-sentinel",
  name: "Placide",
  subname: "Voodoo Sentinel",
  displayName: "Placide - Voodoo Sentinel",
  rulesText:
    "PLAY ATTACK You may discard a Program from your hand. If you do, bottom-deck a rival Unit.",
  flavorText: null,
  color: "blue",
  classifications: ["Ganger", "Netrunner", "Voodoo Boys"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "073",
  printings: [
    {
      id: "4b8e26aa-4406-4a4d-9ffc-0ac9f5b774bf",
      collectorNumber: "073",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b073.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b073.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Mooncolony",
    },
  ],
  selectedPrintingId: "4b8e26aa-4406-4a4d-9ffc-0ac9f5b774bf",
  artist: "Mooncolony",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b073.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b073.webp",
  rarity: null,
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
      text: "PLAY ATTACK You may discard a Program from your hand. If you do, bottom-deck a rival Unit.",
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
            effect: "moveCard",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["program"],
            },
            destination: "trash",
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
      text: "PLAY ATTACK You may discard a Program from your hand. If you do, bottom-deck a rival Unit.",
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
            effect: "moveCard",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["program"],
            },
            destination: "trash",
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
} satisfies SpoilerCardDefinition;
