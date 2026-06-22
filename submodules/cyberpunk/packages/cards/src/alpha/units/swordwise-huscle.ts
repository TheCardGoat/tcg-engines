import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";

export const alphaSwordwiseHuscle = {
  id: "cd144f92-a06d-4223-b014-bf81aa4a4ea0",
  externalId: "cyberpunk:swordwise-huscle",
  slug: "swordwise-huscle",
  name: "Swordwise Huscle",
  displayName: "Swordwise Huscle",
  color: "red",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α009",
  printings: [
    {
      id: "1dc9c8ef-00e4-4d40-9404-5f1004933bd7",
      collectorNumber: "α009",
      setCode: "alpha",
      rarity: null,
    },
  ],
  selectedPrintingId: "1dc9c8ef-00e4-4d40-9404-5f1004933bd7",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a009.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 3,
  power: 5,
  abilities: [],
  reminderText: [],
} satisfies AlphaCardDefinition;
