import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailWraithMarauders = defineCyberpunkCard({
  id: "67b47cff-2237-4765-86fb-9b2b3abecbb1",
  slug: "wraith-marauders",
  rulesText:
    "When this Unit steals a Gig, ready another friendly Unit with power equal to the Gig's value.",
  name: "Wraith Marauders",
  displayName: "Wraith Marauders",
  canonicalId: "wraith-marauders",
  color: "green",
  classifications: ["Ganger", "Nomad", "Raffen Shiv"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "092",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/092.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit steals a Gig, ready another friendly Unit with power equal to the Gig's value.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          minAmount: 1,
          source: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ready",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            excludeSelf: true,
            powerEqualsGigValueOf: {
              selector: "context",
              key: "triggeredGigs",
            },
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
