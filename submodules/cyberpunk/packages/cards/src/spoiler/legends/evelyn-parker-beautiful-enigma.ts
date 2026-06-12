import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerEvelynParkerBeautifulEnigma = {
  id: "1636c26f-189b-494d-96fc-6eb3df564d2f",
  externalId: "cyberpunk:evelyn-parker-beautiful-enigma",
  slug: "evelyn-parker-beautiful-enigma",
  name: "Evelyn Parker",
  subname: "Beautiful Enigma",
  displayName: "Evelyn Parker - Beautiful Enigma",
  rulesText:
    "CALL Decrease a rival Gig's value by 3. [Spend Icon]: Search the top 3 cards of your deck for up to 1 Braindance Program. Add it to your hand. Bottom-deck the rest.",
  flavorText: null,
  color: "blue",
  classifications: ["Doll"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "122",
  printings: [
    {
      id: "2f22896b-5b5e-4c62-9b72-37bc64156d01",
      collectorNumber: "122",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b122.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b122.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Pandart Studio",
    },
  ],
  selectedPrintingId: "2f22896b-5b5e-4c62-9b72-37bc64156d01",
  artist: "Pandart Studio",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b122.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b122.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: [],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "CALL Decrease a rival Gig's value by 3.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "modifyGig",
          target: {
            selector: "gig",
            controller: "rival",
          },
          operation: "decrease",
          value: 3,
        },
      ],
    },
    {
      kind: "triggered",
      text: "[Spend Icon]: Search the top 3 cards of your deck for up to 1 Braindance Program. Add it to your hand. Bottom-deck the rest.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
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
          effect: "searchDeck",
          player: "friendly",
          lookCount: 3,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
            cardTypes: ["program"],
            classifications: ["Braindance"],
          },
          select: {
            kind: "upTo",
            max: 1,
          },
          reveal: false,
          destination: "hand",
          remainder: {
            zone: "deckBottom",
          },
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
