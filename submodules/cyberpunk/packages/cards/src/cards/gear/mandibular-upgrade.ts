import { unitsAndLegendsInPlay } from "@tcg/cyberpunk-types";
import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailMandibularUpgradeI18n } from "./mandibular-upgrade.i18n.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailMandibularUpgrade = defineCyberpunkCard(
  {
    id: "6720e7fd-d1e8-4c8a-9ff2-f51f62241902",
    slug: "mandibular-upgrade",
    canonicalId: "mandibular-upgrade",
    color: "yellow",
    classifications: ["Cyberware"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "062",
    artist: "Lea Leonowicz",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/062.webp",
    rarity: "Common",
    legality: "legal",
    hasSellTag: true,
    ram: 2,
    keywords: ["blocker"],
    type: "gear",
    cost: 1,
    power: 0,
    abilities: [blockerAbility({ host: true })],
    attachment: {
      text: "Equip to a unit or face-up legend.",
      target: unitsAndLegendsInPlay("friendly", "faceUp"),
    },
  },
  welcomeToNightCityRetailMandibularUpgradeI18n,
) satisfies GearCardDefinition;
