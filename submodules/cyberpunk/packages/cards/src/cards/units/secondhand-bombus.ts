import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailSecondhandBombusI18n } from "./secondhand-bombus.i18n.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSecondhandBombus = defineCyberpunkCard(
  {
    id: "b05cb065-309e-45a3-bbe0-20f4b6ea71aa",
    slug: "secondhand-bombus",
    canonicalId: "secondhand-bombus",
    color: "yellow",
    classifications: ["Drone", "Zetatech"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "053",
    artist: "Luca Claretti",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/053.webp",
    rarity: "Common",
    legality: "legal",
    hasSellTag: false,
    ram: 2,
    keywords: ["blocker"],
    type: "unit",
    cost: 2,
    power: 0,
    abilities: [blockerAbility()],
    reminderText: ["Units with power 0 don't steal Gigs."],
  },
  welcomeToNightCityRetailSecondhandBombusI18n,
) satisfies UnitCardDefinition;
