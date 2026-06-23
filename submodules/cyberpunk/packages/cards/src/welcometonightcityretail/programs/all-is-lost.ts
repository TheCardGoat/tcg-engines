import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailAllIsLost = {
  id: "1f969c27-dddb-4971-9ab5-bd728c3e3e52",
  externalId: "cb-all-is-lost",
  slug: "all-is-lost",
  name: "All is Lost",
  displayName: "All is Lost",
  rulesText: "Trash 3. Add a Unit from among them to your hand.",
  color: "red",
  classifications: ["Zetatech"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "027",
  printings: [
    {
      id: "d1a3c0e0-e0e7-418d-afb4-e6e43400c42e",
      collectorNumber: "027",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "27a2fceb-5c37-4cfa-8efb-1e4618d22401",
      collectorNumber: "β027",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "d1a3c0e0-e0e7-418d-afb4-e6e43400c42e",
  artist: "Fabrizio De Tommaso",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/027.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "program",
  cost: 1,
  power: null,
  abilities: [
    {
      kind: "static",
      text: "Trash 3. Add a Unit from among them to your hand.",
      effects: [],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies WelcomeToNightCityRetailCardDefinition;
