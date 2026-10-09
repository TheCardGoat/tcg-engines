import { unitsAndLegendsInPlay } from "@tcg/cyberpunk-types";
import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { legendsInPlay } from "@tcg/cyberpunk-types";
import { welcomeToNightCityRetailZetatechBerserkI18n } from "./zetatech-berserk.i18n.ts";

export const welcomeToNightCityRetailZetatechBerserk = defineCyberpunkCard(
  {
    id: "1d7f3d02-27b5-4ab8-af99-f8f2e0fd62cf",
    canonicalId: "zetatech-berserk",
    slug: "zetatech-berserk",
    color: "green",
    classifications: ["Cyberware", "Zetatech"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "096",
    artist: "Mooncolony",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/096.webp",
    rarity: "Common",
    legality: "legal",
    hasSellTag: true,
    ram: 2,
    type: "gear",
    cost: 6,
    power: 3,
    costModifier: {
      reducer: "perTargetCount",
      reductionPerCount: 1,
      target: legendsInPlay("friendly", "faceUp"),
      min: 1,
    },
    attachment: {
      text: "Equip to a unit or face-up legend.",
      target: unitsAndLegendsInPlay("friendly", "faceUp"),
    },
  },
  welcomeToNightCityRetailZetatechBerserkI18n,
) satisfies GearCardDefinition;
