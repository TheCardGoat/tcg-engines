import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";

export const alphaEmergencyAtlus = {
  id: "b599ae78-4351-445d-accb-eec3c4d0c306",
  externalId: "cyberpunk:emergency-atlus",
  slug: "emergency-atlus",
  name: "Emergency Atlus",
  displayName: "Emergency Atlus",
  color: "green",
  classifications: ["Vehicle", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α017",
  printings: [
    {
      id: "17411d89-56b6-4c24-97eb-8a49ed28c2e6",
      collectorNumber: "α017",
      setCode: "alpha",
      rarity: null,
    },
  ],
  selectedPrintingId: "17411d89-56b6-4c24-97eb-8a49ed28c2e6",
  artist: "Robert Sammelin",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a017.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 4,
  power: 7,
  abilities: [],
  reminderText: [],
} satisfies AlphaCardDefinition;
