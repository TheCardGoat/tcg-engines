import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailMandibularUpgrade = {
  id: "6720e7fd-d1e8-4c8a-9ff2-f51f62241902",
  externalId: "cb-mandibular-upgrade",
  slug: "mandibular-upgrade",
  name: "Mandibular Upgrade",
  displayName: "Mandibular Upgrade",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\n{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
  color: "yellow",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "062",
  printings: [
    {
      id: "219b7a29-0f8b-4750-bc46-0f39eec6721b",
      collectorNumber: "062",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "dc0a7e03-54b6-4334-965f-27a3d469fed6",
      collectorNumber: "β062",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "d13b8b15-8e31-448c-b28b-322bb498d0a7",
      collectorNumber: "008",
      setCode: "theheistretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "c3399413-d205-49e7-871a-4f16d7c3ade6",
      collectorNumber: "β008",
      setCode: "theheistbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "219b7a29-0f8b-4750-bc46-0f39eec6721b",
  artist: "Lea Leonowicz",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/062.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["blocker"],
  type: "gear",
  cost: 1,
  power: 0,
  abilities: [
    {
      kind: "keyword",
      text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
      keyword: "blocker",
      source: {
        selector: "host",
      },
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
