import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailTowerfall = defineCyberpunkCard({
  id: "9a0fd5a3-a00b-425c-a251-755eeab12bfe",
  canonicalId: "towerfall",
  slug: "towerfall",
  name: "Towerfall",
  displayName: "Towerfall",
  rulesText:
    "Choose one effect. If you have less ☆ (Street Cred) than a Rival, choose both instead.\nGive all rival Units -5 power this turn. // Bottom-deck all rival Units with power 0.",
  color: "blue",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "138",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/138.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Choose one effect. If you have less ☆ (Street Cred) than a Rival, choose both instead. Give all rival Units -5 power this turn. // Bottom-deck all rival Units with power 0.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "chooseEffect",
          options: [
            {
              id: "both",
              label: "Both effects (less Street Cred than a Rival)",
              conditions: [
                {
                  condition: "streetCredComparison",
                  controller: "friendly",
                  comparison: "lt",
                  other: "rival",
                },
              ],
              effects: [
                {
                  effect: "modifyPower",
                  target: {
                    selector: "card",
                    controller: "rival",
                    zones: ["field"],
                    cardTypes: ["unit"],
                  },
                  value: -5,
                  duration: "turn",
                },
                {
                  effect: "moveCard",
                  target: {
                    selector: "card",
                    controller: "rival",
                    zones: ["field"],
                    cardTypes: ["unit"],
                    maxPower: 0,
                  },
                  destination: "deckBottom",
                },
              ],
            },
            {
              id: "power-down",
              label: "Give all rival Units -5 power this turn",
              conditions: [
                {
                  condition: "not",
                  of: {
                    condition: "streetCredComparison",
                    controller: "friendly",
                    comparison: "lt",
                    other: "rival",
                  },
                },
              ],
              effects: [
                {
                  effect: "modifyPower",
                  target: {
                    selector: "card",
                    controller: "rival",
                    zones: ["field"],
                    cardTypes: ["unit"],
                  },
                  value: -5,
                  duration: "turn",
                },
              ],
            },
            {
              id: "bottom-deck",
              label: "Bottom-deck all rival Units with power 0",
              conditions: [
                {
                  condition: "not",
                  of: {
                    condition: "streetCredComparison",
                    controller: "friendly",
                    comparison: "lt",
                    other: "rival",
                  },
                },
              ],
              effects: [
                {
                  effect: "moveCard",
                  target: {
                    selector: "card",
                    controller: "rival",
                    zones: ["field"],
                    cardTypes: ["unit"],
                    maxPower: 0,
                  },
                  destination: "deckBottom",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 6,
}) satisfies ProgramCardDefinition;
