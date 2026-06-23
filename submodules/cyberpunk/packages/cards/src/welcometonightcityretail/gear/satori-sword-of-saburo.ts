import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSatoriSwordOfSaburo = {
  id: "4670d02b-b97a-4771-bb7e-65bdc012530e",
  externalId: "cb-satori-sword-of-saburo",
  slug: "satori-sword-of-saburo",
  name: "Satori — Sword of Saburo",
  displayName: "Satori — Sword of Saburo",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit wins a fight against a rival Unit, draw 1.",
  color: "red",
  classifications: ["Arasaka", "Weapon"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "026",
  printings: [
    {
      id: "11a8fed4-5401-4cfc-901b-ab9b5b94d0ab",
      collectorNumber: "026",
      setCode: "welcometonightcityretail",
      rarity: "Uncommon",
    },
    {
      id: "b12e1665-bf29-4b2c-b92d-865cff227a67",
      collectorNumber: "β026",
      setCode: "welcometonightcitybeta",
      rarity: "Uncommon",
    },
    {
      id: "0e0e7e20-eaf3-4dea-a177-cb54e01ffec6",
      collectorNumber: "008",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Uncommon",
    },
    {
      id: "e9dba54d-79bf-4f33-bd67-ba026e371c03",
      collectorNumber: "β008",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "11a8fed4-5401-4cfc-901b-ab9b5b94d0ab",
  artist: "Ivan Shavrin",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/026.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 2,
  power: 2,
  abilities: [
    {
      kind: "static",
      text: "When this Unit wins a fight against a rival Unit, draw 1.",
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
