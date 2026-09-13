import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { quickAbility } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailDetonate = defineCyberpunkCard({
  id: "2697ed9d-72fc-4658-9c94-977668911a67",
  canonicalId: "detonate",
  slug: "detonate",
  name: "Detonate",
  displayName: "Detonate",
  rulesText: "{Quick} Defeat a rival Gear with power 2 or less.",
  color: "red",
  classifications: ["Quickhack"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "031",
  artist: "Michal Ivan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/031.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["quick"],
  type: "program",
  cost: 1,
  abilities: [
    quickAbility(),
    {
      kind: "triggered",
      text: "Defeat a rival Gear with power 2 or less.",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["gear"],
            maxPower: 2,
            selection: { mode: "choose", min: 1, max: 1 },
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  power: null,
}) satisfies ProgramCardDefinition;
