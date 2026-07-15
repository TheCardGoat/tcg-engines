import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction =
  defineCyberpunkCard({
    id: "31fa5825-946a-4ca2-afa8-8f07b9898d6a",
    canonicalId: "yorinobu-arasaka-embracing-destruction",
    slug: "yorinobu-arasaka-embracing-destruction",
    name: "Yorinobu Arasaka — Embracing Destruction",
    displayName: "Yorinobu Arasaka — Embracing Destruction",
    rulesText:
      "The first time a friendly ARASAKA Unit attacks each turn, draw 1. Then, if you have less than 20 ☆ (Street Cred), discard 1.",
    color: "red",
    classifications: ["Arasaka", "Corpo"],
    set: {
      code: "embracingpowerretailstarterdeck",
      name: "Embracing Power — Retail Starter Deck",
    },
    printNumber: "001",
    artist: "ADIA",
    imageUrl:
      "https://cdn.tcg.online/public/cyberpunk/cards/embracingpowerretailstarterdeck/001.webp",
    rarity: "Epic",
    legality: "legal",
    hasSellTag: true,
    ram: 2,
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
    type: "legend",
    cost: null,
    power: null,
  }) satisfies LegendCardDefinition;
