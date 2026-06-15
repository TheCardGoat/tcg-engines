import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailElSombreroNLaVenganzaLenta = {
  id: "c688ca08-b3b7-441d-b161-78b9a63a8a9e",
  externalId: "cb-el-sombrero-n-la-venganza-lenta",
  slug: "el-sombrero-n-la-venganza-lenta",
  name: "El Sombrerón — La Venganza Lenta",
  displayName: "El Sombrerón — La Venganza Lenta",
  rulesText:
    "[ATTACK] You may pay 2 €$. If you do, this Unit gains power equal to a friendly max Gig this turn.",
  color: "red",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "009",
  printings: [
    {
      id: "94180516-28a6-4f5c-b79e-de38a95ed47b",
      collectorNumber: "009",
      setCode: "welcometonightcityretail",
      rarity: "Rare",
    },
    {
      id: "c180e174-f1b6-4b9c-b2c8-db0551ae49d2",
      collectorNumber: "β009",
      setCode: "welcometonightcitybeta",
      rarity: "Rare",
    },
  ],
  selectedPrintingId: "94180516-28a6-4f5c-b79e-de38a95ed47b",
  artist: "Rafael de Latorre & Clonerh",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/009.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["attack"],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "ATTACK You may pay 2 €$. If you do, this Unit gains power equal to a friendly max Gig this turn.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      costs: [
        {
          cost: "payEddies",
          amount: 2,
        },
      ],
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "self",
          },
          value: {
            type: "maxGigValue",
            controller: "friendly",
          },
          duration: "turn",
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
