import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailFloorIt = {
  id: "0cd37c43-e722-48eb-91ef-4c1bd1645215",
  externalId: "cb-floor-it",
  slug: "floor-it",
  name: "Floor It",
  displayName: "Floor It",
  rulesText: "{Quick} Give a rival Unit -1 power this turn. Draw 1.",
  color: "blue",
  classifications: ["Merc", "Quickhack"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "132",
  printings: [
    {
      id: "91f9d30c-f74d-4be4-8505-52f05d309c92",
      collectorNumber: "132",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "859c8d1d-b715-4a9a-b7cc-96ecfe135a00",
      collectorNumber: "β132",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "60255f42-3ddd-4865-9e4a-335963694be1",
      collectorNumber: "019",
      setCode: "theheistretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "d8b28345-bcd5-4c52-b51d-3052d8b24874",
      collectorNumber: "β019",
      setCode: "theheistbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "91f9d30c-f74d-4be4-8505-52f05d309c92",
  artist: "DOFRESH",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/132.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["quick"],
  type: "program",
  cost: 1,
  power: null,
  abilities: [
    {
      kind: "keyword",
      text: "Quick",
      keyword: "quick",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "static",
      text: "Give a rival Unit -1 power this turn. Draw 1.",
      effects: [],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies WelcomeToNightCityRetailCardDefinition;
