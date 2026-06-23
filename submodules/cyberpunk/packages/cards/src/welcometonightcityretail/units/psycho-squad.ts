import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailPsychoSquad = {
  id: "14d87f2a-8bd7-424f-b65b-3659156cef81",
  externalId: "cb-psycho-squad",
  slug: "psycho-squad",
  name: "Psycho Squad",
  displayName: "Psycho Squad",
  rulesText: "[Flavour] Their protocol stops at “shoot first.”",
  color: "blue",
  classifications: ["NCPD"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "124",
  printings: [
    {
      id: "d7e0e2e5-6e22-4b45-9e91-50936773e2e1",
      collectorNumber: "124",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "61118bbb-c1f6-4b1d-8d46-4f33f0a135b1",
      collectorNumber: "β124",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "b6295362-bd30-4b91-8755-738938cf839b",
      collectorNumber: "016",
      setCode: "theheistretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "e2fe4b47-4d66-4989-bab7-16143f7256ac",
      collectorNumber: "β016",
      setCode: "theheistbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "d7e0e2e5-6e22-4b45-9e91-50936773e2e1",
  artist: "Kieran McKeown & Giada Marchisio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/124.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 4,
  power: 6,
  abilities: [
    {
      kind: "static",
      text: "[Flavour] Their protocol stops at “shoot first.”",
      effects: [],
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
