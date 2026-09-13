import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailZetatechBerserk = defineCyberpunkCard({
  id: "1d7f3d02-27b5-4ab8-af99-f8f2e0fd62cf",
  canonicalId: "zetatech-berserk",
  slug: "zetatech-berserk",
  name: "Zetatech Berserk",
  displayName: "Zetatech Berserk",
  rulesText: "Play this Gear for -1 €$ for each friendly face-up Legend, to a minimum of 1 €$.",
  color: "green",
  classifications: ["Cyberware", "Zetatech"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "096",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/096.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "gear",
  cost: 6,
  power: 3,
  costModifier: {
    reducer: "perTargetCount",
    reductionPerCount: 1,
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["legendArea"],
      cardTypes: ["legend"],
      face: "faceUp",
    },
    min: 1,
  },
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
