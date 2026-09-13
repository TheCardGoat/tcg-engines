import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailJapantownJonin = defineCyberpunkCard({
  id: "e8b0432c-4d2d-4464-9a00-f3626917a7f0",
  canonicalId: "japantown-jonin",
  slug: "japantown-jonin",
  name: "Japantown Jonin",
  displayName: "Japantown Jonin",
  rulesText:
    "{Play} Give a friendly Unit +2 power this turn.\n(Units with power 0 don't steal Gigs.)",
  color: "red",
  classifications: ["Tyger Claws"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "010",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/010.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "{Play} Give a friendly Unit +2 power this turn.",
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
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          value: 2,
          duration: "turn",
        },
      ],
    },
  ],
  type: "unit",
  cost: 2,
  power: 0,
}) satisfies UnitCardDefinition;
