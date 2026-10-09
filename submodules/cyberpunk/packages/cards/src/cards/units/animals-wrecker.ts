import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailAnimalsWreckerI18n } from "./animals-wrecker.i18n.ts";

export const welcomeToNightCityRetailAnimalsWrecker = defineCyberpunkCard(
  {
    id: "e8aa7757-e5e3-4137-8970-4fa546b9bed9",
    canonicalId: "animals-wrecker",
    slug: "animals-wrecker",
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
  },
  welcomeToNightCityRetailAnimalsWreckerI18n,
) satisfies UnitCardDefinition;
