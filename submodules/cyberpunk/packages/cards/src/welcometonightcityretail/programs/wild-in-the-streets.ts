import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailWildInTheStreets = defineCyberpunkCard({
  id: "3126fa21-ea19-4096-8233-d63797bb9fe4",
  canonicalId: "wild-in-the-streets",
  slug: "wild-in-the-streets",
  name: "Wild in the Streets",
  displayName: "Wild in the Streets",
  rulesText: "Defeat a spent Unit.",
  color: "green",
  classifications: ["Ganger"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "105",
  artist: "Bernard Kowalczuk",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/105.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Defeat a spent Unit.",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            zones: ["field"],
            cardTypes: ["unit"],
            state: "spent",
            selection: { mode: "choose", min: 1, max: 1 },
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 5,
}) satisfies ProgramCardDefinition;
