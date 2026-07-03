import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailMantisBlades = defineCyberpunkCard({
  id: "28198e04-60e2-4f81-9786-903a9a947d7a",
  slug: "mantis-blades",
  rulesText: '(Equip to a friendly Unit or face-up Legend.)\n"One cut, one kill."',
  name: "Mantis Blades",
  displayName: "Mantis Blades",
  canonicalId: "mantis-blades",
  color: "red",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "025",
  artist: "Ricardo Padierne Silvera",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/025.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  type: "gear",
  cost: 1,
  power: 2,
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
}) satisfies GearCardDefinition;
