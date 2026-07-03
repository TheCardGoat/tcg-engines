import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const embracingPowerRetailStarterDeckMinotaur = defineCyberpunkCard({
  id: "066641c5-acc2-45f4-ba67-16a8d20cce73",
  slug: "minotaur",
  rulesText:
    "{Play} If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 5 or less.",
  name: "Minotaur",
  displayName: "Minotaur",
  canonicalId: "minotaur",
  color: "red",
  classifications: ["Arasaka", "Drone", "Militech"],
  set: {
    code: "embracingpowerretailstarterdeck",
    name: "Embracing Power — Retail Starter Deck",
  },
  printNumber: "003",
  artist: "CD Projekt Red",
  imageUrl:
    "https://cdn.tcg.online/public/cyberpunk/cards/embracingpowerretailstarterdeck/003.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 7,
  power: 9,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 5 or less.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      conditions: [
        {
          condition: "streetCredComparison",
          controller: "friendly",
          comparison: "gt",
          other: "rival",
        },
      ],
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 5,
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
