import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailWeGottaLiveTogether = defineCyberpunkCard({
  id: "404748b4-f30e-4bf1-8991-5ad449da755a",
  canonicalId: "we-gotta-live-together",
  slug: "we-gotta-live-together",
  name: "We Gotta Live Together",
  displayName: "We Gotta Live Together",
  rulesText:
    "If a Rival controls at least 2 more Gigs than you, play this Program for 3 €$.\nPlay up to 2 Units with cost 3 or less from your trash for free.",
  color: "green",
  classifications: ["Aldecado", "Nomad"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "104",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/104.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Play up to 2 Units with cost 3 or less from your trash for free.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "playCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            cardTypes: ["unit"],
            maxCost: 3,
          },
          free: true,
          optional: true,
        },
        {
          effect: "playCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            cardTypes: ["unit"],
            maxCost: 3,
          },
          free: true,
          optional: true,
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 5,
  costModifier: {
    reducer: "replace",
    amount: 3,
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
}) satisfies ProgramCardDefinition;
