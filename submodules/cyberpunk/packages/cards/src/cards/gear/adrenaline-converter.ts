import { unitsAndLegendsInPlay } from "@tcg/cyberpunk-types";
import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailAdrenalineConverterI18n } from "./adrenaline-converter.i18n.ts";

export const welcomeToNightCityRetailAdrenalineConverter = defineCyberpunkCard(
  {
    id: "6a5a1e34-fdd3-42de-b6bd-4b2553d6df39",
    canonicalId: "adrenaline-converter",
    slug: "adrenaline-converter",
    color: "yellow",
    classifications: ["Cyberware", "Medtech"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "059",
    artist: "ADIA",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/059.webp",
    rarity: "Common",
    legality: "legal",
    hasSellTag: true,
    ram: 4,
    abilities: [
      {
        kind: "static",
        text: "If a Rival controls at least 2 more Gigs than you, this Unit has Adrenaline.",
        source: {
          selector: "host",
        },
        effects: [
          {
            effect: "grantRule",
            target: {
              selector: "host",
            },
            rule: "adrenaline",
            duration: "continuous",
            conditions: [
              {
                condition: "gigCountDifference",
                controller: "rival",
                comparison: "gte",
                other: "friendly",
                value: 2,
              },
            ],
          },
        ],
      },
    ],
    reminderText: ["This Unit can attack the turn it's played."],
    type: "gear",
    cost: 2,
    power: 3,
    attachment: {
      text: "Equip to a unit or face-up legend.",
      target: unitsAndLegendsInPlay("friendly", "faceUp"),
    },
  },
  welcomeToNightCityRetailAdrenalineConverterI18n,
) satisfies GearCardDefinition;
