import { unitsAndLegendsInPlay } from "@tcg/cyberpunk-types";
import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailRiotShieldI18n } from "./riot-shield.i18n.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRiotShield = defineCyberpunkCard(
  {
    id: "7da95cf0-f749-439f-b40a-9d3057d2c995",
    canonicalId: "riot-shield",
    slug: "riot-shield",
    color: "green",
    classifications: ["Weapon"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "094",
    artist: "TOPDOG Entertainment",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/094.webp",
    rarity: "Uncommon",
    legality: "legal",
    hasSellTag: true,
    ram: 2,
    keywords: ["blocker"],
    abilities: [
      blockerAbility({ host: true }),
      {
        kind: "static",
        text: "Rivals must pay +2 €$ to use Go Solo.",
        effects: [
          {
            effect: "grantRivalGoSoloCostIncrease",
            target: {
              selector: "self",
            },
            amount: 2,
            duration: "continuous",
          },
        ],
      },
    ],
    type: "gear",
    cost: 2,
    power: 1,
    attachment: {
      text: "Equip to a unit or face-up legend.",
      target: unitsAndLegendsInPlay("friendly", "faceUp"),
    },
  },
  welcomeToNightCityRetailRiotShieldI18n,
) satisfies GearCardDefinition;
