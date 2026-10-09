import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailRidingNomadI18n } from "./riding-nomad.i18n.ts";
import { adrenalineAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRidingNomad = defineCyberpunkCard(
  {
    id: "20bcc767-29f0-4aa0-b842-4d4e546ed36e",
    slug: "riding-nomad",
    canonicalId: "riding-nomad",
    color: "green",
    classifications: ["Nomad"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "087",
    artist: "Michal Ivan",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/087.webp",
    rarity: "Common",
    legality: "legal",
    hasSellTag: false,
    ram: 4,
    keywords: ["adrenaline"],
    type: "unit",
    cost: 5,
    power: 4,
    abilities: [adrenalineAbility()],
  },
  welcomeToNightCityRetailRidingNomadI18n,
) satisfies UnitCardDefinition;
