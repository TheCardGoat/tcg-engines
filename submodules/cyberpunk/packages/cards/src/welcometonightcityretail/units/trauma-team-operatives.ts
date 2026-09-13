import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailTraumaTeamOperatives = defineCyberpunkCard({
  id: "2a4a1f1a-9888-403e-90a9-4021c3f52674",
  canonicalId: "trauma-team-operatives",
  slug: "trauma-team-operatives",
  name: "Trauma Team Operatives",
  displayName: "Trauma Team Operatives",
  rulesText: "Play this Unit for -1 €$ for each Unit in your trash, to a minimum of 1 €$.",
  color: "yellow",
  classifications: ["Medtech", "Trauma Team"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "056",
  artist: "Michal Ivan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/056.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  type: "unit",
  cost: 6,
  power: 7,
  costModifier: {
    reducer: "perTargetCount",
    reductionPerCount: 1,
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["trash"],
      cardTypes: ["unit"],
    },
    min: 1,
  },
}) satisfies UnitCardDefinition;
