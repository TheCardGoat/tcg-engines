import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const alphaEmergencyAtlus = defineCyberpunkCard({
  id: "b599ae78-4351-445d-accb-eec3c4d0c306",
  slug: "emergency-atlus",
  name: "Emergency Atlus",
  displayName: "Emergency Atlus",
  canonicalId: "emergency-atlus",
  color: "green",
  classifications: ["Vehicle", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α017",
  artist: "Robert Sammelin",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a017.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  type: "unit",
  cost: 4,
  power: 7,
}) satisfies UnitCardDefinition;
