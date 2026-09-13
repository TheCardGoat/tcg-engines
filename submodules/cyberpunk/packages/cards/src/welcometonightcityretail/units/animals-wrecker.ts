import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailAnimalsWrecker = defineCyberpunkCard({
  id: "e8aa7757-e5e3-4137-8970-4fa546b9bed9",
  canonicalId: "animals-wrecker",
  slug: "animals-wrecker",
  name: "Animals Wrecker",
  displayName: "Animals Wrecker",
  rulesText: "[Flavour Text] Takes a lot of juice to break bones like they do.",
  color: "red",
  classifications: ["Animal", "Ganger"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "007",
  artist: "Michal Ivan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/007.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  type: "unit",
  cost: 6,
  power: 10,
}) satisfies UnitCardDefinition;
