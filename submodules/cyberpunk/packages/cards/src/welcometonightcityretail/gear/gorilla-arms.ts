import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailGorillaArms = {
  id: "500ae9b9-0afa-4b82-87ed-61c72583139c",
  externalId: "cb-gorilla-arms",
  slug: "gorilla-arms",
  name: "Gorilla Arms",
  displayName: "Gorilla Arms",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nThe first time this Unit steals 1 or more Gigs each turn, steal a rival Gig with a value not shared by a friendly Gig.",
  color: "yellow",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "060",
  printings: [
    {
      id: "e1959b9e-d32d-43be-94c3-a595809e0c28",
      collectorNumber: "060",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "73b6b3d3-6a7f-44ed-a267-add6ae389b5a",
      collectorNumber: "β060",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "e1959b9e-d32d-43be-94c3-a595809e0c28",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/060.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 4,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "The first time this Unit steals 1 or more Gigs each turn, steal a rival Gig with a value not shared by a friendly Gig.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          minAmount: 1,
          source: {
            selector: "host",
          },
        },
      },
      source: {
        selector: "host",
      },
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "stealGig",
          target: {
            selector: "gig",
            controller: "rival",
            valueNotSharedBy: {
              selector: "gig",
              controller: "friendly",
              amount: "all",
            },
          },
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
} satisfies StructuredCardDefinition;
