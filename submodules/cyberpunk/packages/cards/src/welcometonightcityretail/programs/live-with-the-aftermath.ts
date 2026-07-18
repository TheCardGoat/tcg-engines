import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailLiveWithTheAftermath = defineCyberpunkCard({
  id: "793d9650-0a59-4c89-9d85-05a9d6873d2e",
  canonicalId: "live-with-the-aftermath",
  slug: "live-with-the-aftermath",
  rulesText: "Each player defeats one of their Units.",
  name: "Live with the Aftermath",
  displayName: "Live with the Aftermath",
  color: "yellow",
  classifications: ["Plan"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "068",
  artist: "DOFRESH",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/068.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Each player defeats one of their Units.",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: { mode: "choose", min: 1, max: 1 },
          },
        },
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: { mode: "choose", min: 1, max: 1, chooser: "rival" },
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
