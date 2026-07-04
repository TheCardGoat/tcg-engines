import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailCorporateSurveillance = defineCyberpunkCard({
  id: "71fb410b-b56e-42b2-a793-4c49e935b9f1",
  slug: "corporate-surveillance",
  rulesText: "Spend a rival Unit with cost 4 or less.",
  name: "Corporate Surveillance",
  displayName: "Corporate Surveillance",
  canonicalId: "corporate-surveillance",
  color: "green",
  classifications: ["Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "097",
  artist: "John Liew",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/097.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Spend a rival Unit with cost 4 or less.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "spend",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 4,
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
