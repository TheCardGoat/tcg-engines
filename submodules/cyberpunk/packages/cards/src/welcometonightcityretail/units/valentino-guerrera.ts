import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailValentinoGuerrera = defineCyberpunkCard({
  id: "5cf0c12a-814e-4801-8171-7fe8c09fad21",
  canonicalId: "valentino-guerrera",
  slug: "valentino-guerrera",
  name: "Valentino Guerrera",
  displayName: "Valentino Guerrera",
  rulesText:
    "If you have more ☆ (Street Cred) than a Rival, this Unit can attack ready Units with {Blocker}.",
  color: "red",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "021",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/021.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "static",
      text: "If you have more ☆ (Street Cred) than a Rival, this Unit can attack ready Units with {Blocker}.",
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
          effect: "grantRule",
          target: { selector: "self" },
          rule: "canAttackReadyBlockers",
          duration: "continuous",
        },
      ],
    },
  ],
  type: "unit",
  cost: 3,
  power: 4,
}) satisfies UnitCardDefinition;
