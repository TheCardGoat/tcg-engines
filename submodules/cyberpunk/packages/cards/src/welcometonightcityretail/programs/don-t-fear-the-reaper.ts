import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailDonTFearTheReaper = defineCyberpunkCard({
  id: "17a80b46-c583-4867-97ac-7855494363a9",
  canonicalId: "don-t-fear-the-reaper",
  slug: "don-t-fear-the-reaper",
  name: "(Don't Fear) The Reaper",
  displayName: "(Don't Fear) The Reaper",
  rulesText: "Spend all rival Units. Then, defeat a spent Unit.",
  color: "green",
  classifications: ["Samurai"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "098",
  artist: "Alex Eckman-Lawn",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/098.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Spend all rival Units. Then, defeat a spent Unit.",
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
          },
        },
        {
          effect: "defeat",
          target: {
            selector: "card",
            zones: ["field"],
            cardTypes: ["unit"],
            state: "spent",
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
  cost: 7,
}) satisfies ProgramCardDefinition;
