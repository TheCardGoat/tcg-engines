import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailRoyceDonTCallMeSimon = defineCyberpunkCard({
  id: "9e465b11-9743-4275-a71d-d701b059eef0",
  slug: "royce-don-t-call-me-simon",
  rulesText:
    "{Play} Defeat a rival Unit with power 2 or less. If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 3 or less instead.",
  name: "Royce — Don't Call Me Simon",
  displayName: "Royce — Don't Call Me Simon",
  canonicalId: "royce-don-t-call-me-simon",
  color: "red",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "016",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/016.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Defeat a rival Unit with power 2 or less. If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 3 or less instead.",
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
            maxPower: 3,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "gt",
              other: "rival",
            },
          ],
        },
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 2,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "lte",
              other: "rival",
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
