import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerMamanBrigitte = {
  id: "0e07190f-3e75-4b5e-ba24-5840801d9f34",
  externalId: "cyberpunk:maman-brigitte",
  slug: "maman-brigitte",
  name: "Maman Brigitte",
  subname: null,
  displayName: "Maman Brigitte",
  rulesText: "PLAY You may discard 2 Programs. If you do, bottom-deck a rival unequipped Unit.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "blue",
  classifications: ["Mystic", "Netrunner", "Voodoo Boys"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "118",
  printings: [
    {
      id: "61e6b13d-963f-4ac4-b142-24f8c6497a84",
      collectorNumber: "118",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b118.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b118.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "TOPDOG Entertainment",
    },
  ],
  selectedPrintingId: "61e6b13d-963f-4ac4-b142-24f8c6497a84",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b118.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b118.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY You may discard 2 Programs. If you do, bottom-deck a rival unequipped Unit.",
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
            amount: 2,
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
                hasAttachedCards: false,
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
