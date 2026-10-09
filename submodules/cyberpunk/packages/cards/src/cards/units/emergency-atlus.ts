import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailEmergencyAtlusI18n } from "./emergency-atlus.i18n.ts";

export const welcomeToNightCityRetailEmergencyAtlus = defineCyberpunkCard(
  {
    id: "917e6515-ed23-4a1d-baaa-474d879bdabc",
    slug: "emergency-atlus",
    canonicalId: "emergency-atlus",
    color: "green",
    classifications: ["Trauma Team", "Vehicle", "Zetatech"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "077",
    artist: "Robert Sammelin",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/077.webp",
    rarity: "Common",
    legality: "legal",
    hasSellTag: false,
    ram: 1,
    type: "unit",
    cost: 3,
    power: 4,
  },
  welcomeToNightCityRetailEmergencyAtlusI18n,
) satisfies UnitCardDefinition;
