import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailKiroshiOptics = {
  id: "654f2289-5d75-4f8b-bd35-702031fbb214",
  externalId: "cb-kiroshi-optics",
  slug: "kiroshi-optics",
  name: "Kiroshi Optics",
  displayName: "Kiroshi Optics",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\n{Attack} Look at a friendly face-down Legend. (Don't reveal it.)",
  color: "yellow",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "061",
  printings: [
    {
      id: "ec3368a9-79f1-4dfc-9cf7-1cb464ec1c88",
      collectorNumber: "061",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "d35720e4-f307-4732-ae3d-8f47f1351549",
      collectorNumber: "β061",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "aa9b8a2e-ffd6-4435-8bed-c4e64e1c32ac",
      collectorNumber: "007",
      setCode: "theheistretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "b18ce43d-3441-4a55-a6a9-34ae8765aa27",
      collectorNumber: "β007",
      setCode: "theheistbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "ec3368a9-79f1-4dfc-9cf7-1cb464ec1c88",
  artist: "CD Projekt Red",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/061.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 1,
  power: 1,
  abilities: [
    {
      kind: "static",
      text: "Attack Look at a friendly face-down Legend. (Don't reveal it.)",
      effects: [],
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
} satisfies WelcomeToNightCityRetailCardDefinition;
