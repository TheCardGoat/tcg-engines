import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerZetatechFaceplate = {
  id: "eead1bba-f247-423e-a4f5-b330945887b0",
  externalId: "cyberpunk:zetatech-faceplate",
  slug: "zetatech-faceplate",
  name: "Zetatech Faceplate",
  subname: null,
  displayName: "Zetatech Faceplate",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.) When this Unit or Legend is spent, adjust a Gig by up to 1. Then, if you control 3 or more Gigs with different values, draw 1.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Cyberware", "Zetatech"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "064",
  printings: [
    {
      id: "2bc6dcf3-1690-453e-9ee4-705d08f3fcf6",
      collectorNumber: "064",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b064.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b064.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "ADIA",
    },
  ],
  selectedPrintingId: "2bc6dcf3-1690-453e-9ee4-705d08f3fcf6",
  artist: "ADIA",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b064.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b064.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 2,
  power: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit or Legend is spent, adjust a Gig by up to 1. Then, if you control 3 or more Gigs with different values, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardSpent",
          player: "friendly",
          target: {
            selector: "host",
          },
        },
      },
      source: {
        selector: "host",
      },
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            amount: 1,
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
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
          maxAmount: 1,
          direction: "either",
          chooseUpTo: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "hasDistinctGigValues",
              controller: "friendly",
              minCount: 3,
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
  attachment: {
    text: "Equip to a unit or face-up legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  },
} satisfies SpoilerCardDefinition;
