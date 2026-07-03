import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailOverTheEdge = defineCyberpunkCard({
  id: "144c3559-3518-4c01-b9e6-af42b7166661",
  canonicalId: "over-the-edge",
  slug: "over-the-edge",
  rulesText: "Defeat a Unit with power equal to or less than the value of a friendly d20.",
  name: "Over the Edge",
  displayName: "Over the Edge",
  color: "red",
  classifications: ["Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "034",
  artist: "Roberto Ricci",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/034.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Defeat a Unit with power equal to or less than the value of a friendly d20.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPowerOfGigValueOf: {
              selector: "gig",
              controller: "friendly",
              sides: "d20",
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
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 3,
  power: null,
}) satisfies ProgramCardDefinition;
