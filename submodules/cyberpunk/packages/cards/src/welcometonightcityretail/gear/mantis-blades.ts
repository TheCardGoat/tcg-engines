import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailMantisBlades = {
  id: "28198e04-60e2-4f81-9786-903a9a947d7a",
  externalId: "cb-mantis-blades",
  slug: "mantis-blades",
  name: "Mantis Blades",
  displayName: "Mantis Blades",
  rulesText: '(Equip to a friendly Unit or face-up Legend.)\n"One cut, one kill."',
  color: "red",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "025",
  printings: [
    {
      id: "7ffa8ba4-f187-4ba0-a719-fa8ebf45a03b",
      collectorNumber: "025",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "84278f23-7323-47d2-b639-23edd76f87ae",
      collectorNumber: "β025",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "087c30c2-1a7d-423e-b2f3-a7e1e8cfca12",
      collectorNumber: "007",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Uncommon",
    },
    {
      id: "7e3cd1e0-4438-46e7-a327-0d9846778bb3",
      collectorNumber: "β007",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "7ffa8ba4-f187-4ba0-a719-fa8ebf45a03b",
  artist: "Ricardo Padierne Silvera",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/025.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 1,
  power: 2,
  abilities: [
    {
      kind: "static",
      text: '"One cut, one kill."',
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
