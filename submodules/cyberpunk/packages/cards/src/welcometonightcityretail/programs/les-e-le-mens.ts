import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailLesELeMens = defineCyberpunkCard({
  id: "c29aefc5-c8dd-4188-95d9-e46c5ee289eb",
  canonicalId: "les-e-le-mens",
  slug: "les-e-le-mens",
  name: "Les Élémens",
  displayName: "Les Élémens",
  rulesText: "Bottom-deck a Rival's lowest-power Unit. (If there are multiple, choose 1.)",
  color: "blue",
  classifications: ["Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "133",
  artist: "Bernard Kowalczuk",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/133.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Bottom-deck a Rival's lowest-power Unit. (If there are multiple, choose 1.)",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      effects: [
        {
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            lowestPower: true,
            selection: { mode: "choose", min: 1, max: 1 },
          },
          destination: "deckBottom",
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 5,
}) satisfies ProgramCardDefinition;
