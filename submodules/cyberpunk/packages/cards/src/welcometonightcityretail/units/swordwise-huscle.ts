import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSwordwiseHuscle = {
  id: "3c4e7fcb-933d-4712-9ce7-6052a14f8e94",
  externalId: "cb-swordwise-huscle",
  slug: "swordwise-huscle",
  name: "Swordwise Huscle",
  displayName: "Swordwise Huscle",
  rulesText: "{Attack} If this Unit has power 5+, draw 1.",
  color: "red",
  classifications: ["Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "019",
  printings: [
    {
      id: "1c053198-187e-49ab-a9e0-0661b4c3b337",
      collectorNumber: "019",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "1b182145-b318-4b10-85e2-fdbf5afdf3c0",
      collectorNumber: "β019",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "9ecace66-9724-4582-8a45-ae614ffc640f",
      collectorNumber: "005",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "6c695f7c-8b57-4932-aa4c-d85f0b1d29e3",
      collectorNumber: "β005",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "1c053198-187e-49ab-a9e0-0661b4c3b337",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/019.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 3,
  power: 3,
  abilities: [
    {
      kind: "static",
      text: "Attack If this Unit has power 5+, draw 1.",
      effects: [],
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
