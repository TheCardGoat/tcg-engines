import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailRocknRockerboy = defineCyberpunkCard({
  id: "7ea6eecc-e55e-4634-93eb-b2b46e79635d",
  canonicalId: "rockn-rockerboy",
  slug: "rockn-rockerboy",
  name: "Rockn' Rockerboy",
  displayName: "Rockn' Rockerboy",
  rulesText: "[Flavor] Scream your throat raw for something. Anything.",
  color: "yellow",
  classifications: ["Rocker"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "052",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/052.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  type: "unit",
  cost: 5,
  power: 8,
}) satisfies UnitCardDefinition;
