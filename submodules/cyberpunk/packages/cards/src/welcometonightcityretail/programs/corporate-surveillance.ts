import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailCorporateSurveillance = {
  id: "71fb410b-b56e-42b2-a793-4c49e935b9f1",
  externalId: "cb-corporate-surveillance",
  slug: "corporate-surveillance",
  name: "Corporate Surveillance",
  displayName: "Corporate Surveillance",
  rulesText: "Spend a rival Unit with cost 4 or less.",
  color: "green",
  classifications: ["Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "097",
  printings: [
    {
      id: "d3dc7194-a545-4588-9702-b094c27ce359",
      collectorNumber: "097",
      setCode: "welcometonightcityretail",
      rarity: "Uncommon",
    },
    {
      id: "539138ff-af5a-47e3-abf0-cc772eaa8b9e",
      collectorNumber: "β097",
      setCode: "welcometonightcitybeta",
      rarity: "Uncommon",
    },
    {
      id: "8a13760d-050c-4a9c-bc44-f6b5796bb9f2",
      collectorNumber: "020",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Uncommon",
    },
    {
      id: "e9d18fa1-0069-4b22-b64e-a75d2e30158a",
      collectorNumber: "β020",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "d3dc7194-a545-4588-9702-b094c27ce359",
  artist: "John Liew",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/097.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Spend a rival Unit with cost 4 or less.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "spend",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 4,
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies WelcomeToNightCityRetailCardDefinition;
