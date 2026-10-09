import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailPsychoSquadI18n } from "./psycho-squad.i18n.ts";

export const welcomeToNightCityRetailPsychoSquad = defineCyberpunkCard(
  {
    id: "14d87f2a-8bd7-424f-b65b-3659156cef81",
    slug: "psycho-squad",
    canonicalId: "psycho-squad",
    color: "blue",
    classifications: ["NCPD"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "124",
    artist: "Kieran McKeown & Giada Marchisio",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/124.webp",
    rarity: "Common",
    legality: "legal",
    hasSellTag: false,
    ram: 1,
    type: "unit",
    cost: 4,
    power: 6,
  },
  welcomeToNightCityRetailPsychoSquadI18n,
) satisfies UnitCardDefinition;
