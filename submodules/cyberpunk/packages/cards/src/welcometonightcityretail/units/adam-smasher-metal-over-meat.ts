import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailAdamSmasherMetalOverMeat = defineCyberpunkCard({
  id: "a2ad9c2f-bfb7-473b-9408-91af142d269d",
  slug: "adam-smasher-metal-over-meat",
  rulesText: "{Play} Defeat all other Units.",
  name: "Adam Smasher — Metal Over Meat",
  displayName: "Adam Smasher — Metal Over Meat",
  canonicalId: "adam-smasher-metal-over-meat",
  color: "yellow",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "041",
  artist: "Dardo Studios",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/041.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: false,
  ram: 6,
  timingTriggers: ["play"],
  type: "unit",
  cost: 9,
  power: 15,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Defeat all other Units.",
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
            excludeSelf: true,
          },
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
