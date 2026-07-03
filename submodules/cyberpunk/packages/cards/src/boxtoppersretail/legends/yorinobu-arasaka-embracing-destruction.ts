import type { BoxToppersRetailCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const boxTopperRetailYorinobuArasakaEmbracingDestruction = defineCyberpunkCard({
  id: "31fa5825-946a-4ca2-afa8-8f07b9898d6a",
  slug: "yorinobu-arasaka-embracing-destruction",
  canonicalId: "yorinobu-arasaka-embracing-destruction",
  name: "Yorinobu Arasaka — Embracing Destruction",
  displayName: "Yorinobu Arasaka — Embracing Destruction",
  rulesText:
    "The first time a friendly ARASAKA Unit attacks each turn, draw 1. Then, if you have less than 20 ☆ (Street Cred), discard 1.",
  color: "red",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "001",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/boxtoppersretail/001.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "The first time a friendly ARASAKA Unit attacks each turn, draw 1. Then, if you have less than 20 ☆ (Street Cred), discard 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardAttacks",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            classifications: ["Arasaka"],
          },
        },
      },
      source: {
        selector: "self",
      },
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
        },
        {
          effect: "discardFromHand",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "streetCred",
              controller: "friendly",
              comparison: "lt",
              value: 20,
            },
          ],
        },
      ],
    },
  ],
}) satisfies BoxToppersRetailCardDefinition;
