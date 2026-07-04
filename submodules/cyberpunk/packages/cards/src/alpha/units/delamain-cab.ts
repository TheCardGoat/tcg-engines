import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const alphaDelamainCab = defineCyberpunkCard({
  id: "5dba6f6d-b7da-46a7-946d-670bdfb1fe6f",
  slug: "delamain-cab",
  name: "Delamain Cab",
  displayName: "Delamain Cab",
  canonicalId: "delamain-cab",
  color: "blue",
  classifications: ["Vehicle"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α010",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a010.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  type: "unit",
  cost: 4,
  power: 7,
}) satisfies UnitCardDefinition;
