import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailMoxInciters = defineCyberpunkCard({
  id: "ef77dd1f-3abd-4ce2-becc-97dd768a5022",
  canonicalId: "mox-inciters",
  slug: "mox-inciters",
  rulesText:
    "{Play} A rival Unit must attack next turn if it can.\n{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
  name: "Mox Inciters",
  displayName: "Mox Inciters",
  color: "blue",
  classifications: ["Ganger", "Mox"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "122",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/122.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: ["blocker"],
  abilities: [
    blockerAbility({
      text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
    }),
    {
      kind: "triggered",
      text: "Play A rival Unit must attack next turn if it can.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "grantRule",
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
          rule: "mustAttack",
          duration: "untilSourceNextTurn",
        },
      ],
    },
  ],
  type: "unit",
  cost: 3,
  power: 2,
}) satisfies UnitCardDefinition;
