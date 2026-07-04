import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const alphaSwordwiseHuscle = defineCyberpunkCard({
  id: "cd144f92-a06d-4223-b014-bf81aa4a4ea0",
  slug: "swordwise-huscle",
  name: "Swordwise Huscle",
  displayName: "Swordwise Huscle",
  canonicalId: "swordwise-huscle",
  color: "red",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α009",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a009.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  type: "unit",
  cost: 3,
  power: 5,
}) satisfies UnitCardDefinition;
