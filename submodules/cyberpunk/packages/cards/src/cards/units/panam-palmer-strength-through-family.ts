import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { legendsInPlay } from "@tcg/cyberpunk-types";
import { welcomeToNightCityRetailPanamPalmerStrengthThroughFamilyI18n } from "./panam-palmer-strength-through-family.i18n.ts";

export const welcomeToNightCityRetailPanamPalmerStrengthThroughFamily = defineCyberpunkCard(
  {
    id: "34774f04-4f16-40eb-8ee4-999144e572ab",
    canonicalId: "panam-palmer-strength-through-family",
    slug: "panam-palmer-strength-through-family",
    color: "green",
    classifications: ["Aldecado", "Merc", "Nomad"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "085",
    artist: "Ilya Kuvshinov",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/085.webp",
    rarity: "Secret",
    legality: "legal",
    hasSellTag: false,
    ram: 4,
    timingTriggers: ["attack"],
    abilities: [
      {
        kind: "static",
        text: "During your turn, you may Call a Legend for free.",
        effects: [
          {
            effect: "grantRule",
            target: {
              selector: "self",
            },
            rule: "callLegendFree",
            duration: "continuous",
            conditions: [
              {
                condition: "turn",
                player: "friendly",
              },
            ],
          },
        ],
      },
      {
        kind: "triggered",
        text: "ATTACK Discard 1. If you do, draw 1 for each friendly face-up Legend.",
        trigger: {
          trigger: "attack",
        },
        source: {
          selector: "self",
        },
        effects: [
          {
            effect: "ifYouDo",
            doEffect: {
              effect: "discardFromHand",
              player: "friendly",
              amount: 1,
            },
            ifEffects: [
              {
                effect: "draw",
                player: "friendly",
                amount: {
                  type: "perCount",
                  multiplier: 1,
                  target: legendsInPlay("friendly", "faceUp"),
                },
              },
            ],
          },
        ],
      },
    ],
    type: "unit",
    cost: 6,
    power: 6,
  },
  welcomeToNightCityRetailPanamPalmerStrengthThroughFamilyI18n,
) satisfies UnitCardDefinition;
