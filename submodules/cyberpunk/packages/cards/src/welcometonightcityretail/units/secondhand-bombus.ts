import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSecondhandBombus = {
  id: "b05cb065-309e-45a3-bbe0-20f4b6ea71aa",
  externalId: "cb-secondhand-bombus",
  slug: "secondhand-bombus",
  name: "Secondhand Bombus",
  displayName: "Secondhand Bombus",
  rulesText:
    "{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)\n(Units with power 0 don't steal Gigs.)",
  color: "yellow",
  classifications: ["Drone", "Zetatech"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "053",
  printings: [
    {
      id: "fcbb6d58-6666-4bd3-8ff0-64930fb0f422",
      collectorNumber: "053",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "6a8e2aae-694a-43ea-8e3a-0482046a90c5",
      collectorNumber: "β053",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "b7d9313c-f2a4-40c0-85ed-81adb7653125",
      collectorNumber: "005",
      setCode: "theheistretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "2e2f977d-e0a6-4a21-a6b3-92937eb6e909",
      collectorNumber: "β005",
      setCode: "theheistbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "fcbb6d58-6666-4bd3-8ff0-64930fb0f422",
  artist: "Luca Claretti",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/053.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: ["blocker"],
  type: "unit",
  cost: 2,
  power: 0,
  abilities: [
    {
      kind: "keyword",
      text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
      keyword: "blocker",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "static",
      text: "(Units with power 0 don't steal Gigs.)",
      effects: [],
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
