import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSandevistan = {
  id: "55153b49-c3a7-4208-a47b-0a91fa7e3b5c",
  externalId: "cb-sandevistan",
  slug: "sandevistan",
  name: "Sandevistan",
  displayName: "Sandevistan",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nAt the end of your turn, ready this Unit or Legend.",
  color: "green",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "095",
  printings: [
    {
      id: "97de62e2-3fea-4324-8367-87d1f1d674ed",
      collectorNumber: "095",
      setCode: "welcometonightcityretail",
      rarity: "Uncommon",
    },
    {
      id: "f0de2baf-27a9-426e-89cf-68abaceec507",
      collectorNumber: "β095",
      setCode: "welcometonightcitybeta",
      rarity: "Uncommon",
    },
    {
      id: "a4684963-6c44-4e6e-9466-56d987f86112",
      collectorNumber: "019",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Uncommon",
    },
    {
      id: "e1a14bfa-cd87-4fa9-bfe8-207abb4545c4",
      collectorNumber: "β019",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "97de62e2-3fea-4324-8367-87d1f1d674ed",
  artist: "CD Projekt Red",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/095.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 3,
  power: 2,
  abilities: [
    {
      kind: "static",
      text: "At the end of your turn, ready this Unit or Legend.",
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
