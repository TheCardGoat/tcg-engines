import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailFloorIt = defineCyberpunkCard({
  id: "0cd37c43-e722-48eb-91ef-4c1bd1645215",
  slug: "floor-it",
  rulesText: "{Quick} Give a rival Unit -1 power this turn. Draw 1.",
  name: "Floor It",
  displayName: "Floor It",
  canonicalId: "floor-it",
  color: "blue",
  classifications: ["Merc", "Quickhack"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "132",
  artist: "DOFRESH",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/132.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  keywords: ["quick"],
  type: "program",
  cost: 1,
  power: null,
  abilities: [
    quickAbility({ text: "Quick" }),
    {
      kind: "triggered",
      text: "Give a rival Unit -1 power this turn. Draw 1.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          value: -1,
          duration: "turn",
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
