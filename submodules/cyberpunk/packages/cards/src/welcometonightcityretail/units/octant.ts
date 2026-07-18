import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailOctant = defineCyberpunkCard({
  id: "4c098450-e3ae-47e5-98d4-d51a2ab132ce",
  canonicalId: "octant",
  slug: "octant",
  rulesText: "Play this Unit for -1 €$ for each friendly Gig with 8+ value, to a minimum of 1 €$.",
  name: "Octant",
  displayName: "Octant",
  color: "red",
  classifications: ["Drone", "Militech", "Zetatech"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "015",
  artist: "CD Projekt Red",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/015.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  type: "unit",
  cost: 7,
  power: 8,
  costModifier: {
    reducer: "perTargetCount",
    reductionPerCount: 1,
    target: {
      selector: "gig",
      controller: "friendly",
      amount: "all",
      minValue: 8,
    },
    min: 1,
  },
}) satisfies UnitCardDefinition;
