import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailElSombreroNLaVenganzaLenta = defineCyberpunkCard({
  id: "c688ca08-b3b7-441d-b161-78b9a63a8a9e",
  slug: "el-sombrero-n-la-venganza-lenta",
  rulesText:
    "{Attack} You may pay 2 €$. If you do, this Unit gains power equal to a friendly max Gig this turn.",
  name: "El Sombrerón — La Venganza Lenta",
  displayName: "El Sombrerón — La Venganza Lenta",
  canonicalId: "el-sombrero-n-la-venganza-lenta",
  color: "red",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "009",
  artist: "Rafael de Latorre & Clonerh",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/009.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["attack"],
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "ATTACK You may pay 2 €$. If you do, this Unit gains power equal to a friendly max Gig this turn.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      costs: [
        {
          cost: "payEddies",
          amount: 2,
        },
      ],
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "self",
          },
          value: {
            type: "maxGigValue",
            controller: "friendly",
          },
          duration: "turn",
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
