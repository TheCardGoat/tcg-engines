import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailAdamSmasherEnderOfLegends = defineCyberpunkCard({
  id: "eff41c12-b872-4101-9779-00e691532893",
  slug: "adam-smasher-ender-of-legends",
  rulesText:
    "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\n{Play} Defeat a rival Unit.",
  name: "Adam Smasher — Ender of Legends",
  displayName: "Adam Smasher — Ender of Legends",
  canonicalId: "adam-smasher-ender-of-legends",
  color: "red",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "001",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/001.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  keywords: ["goSolo"],
  type: "legend",
  cost: 9,
  power: 9,
  abilities: [
    {
      kind: "keyword",
      text: "GO SOLO",
      keyword: "goSolo",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "PLAY Defeat a rival Unit.",
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
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
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
}) satisfies LegendCardDefinition;
