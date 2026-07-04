import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const promoLucynaKushinada = defineCyberpunkCard({
  id: "3f2e5d58-dea3-4090-8fe7-0f5f4af2d333",
  slug: "lucyna-kushinada",
  name: "Lucyna Kushinada",
  displayName: "Lucyna Kushinada",
  canonicalId: "lucyna-kushinada",
  color: "blue",
  classifications: ["Overclocking"],
  set: {
    code: "promo",
    name: "Promo Cards",
  },
  printNumber: "N001",
  artist: "Pandart Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/promo/n001.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  type: "legend",
  cost: null,
  power: 0,
}) satisfies LegendCardDefinition;
