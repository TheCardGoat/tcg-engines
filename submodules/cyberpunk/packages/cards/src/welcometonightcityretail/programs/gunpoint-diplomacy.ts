import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailGunpointDiplomacy = defineCyberpunkCard({
  id: "27c01b18-2a9c-4d66-ad21-b75869fba666",
  canonicalId: "gunpoint-diplomacy",
  slug: "gunpoint-diplomacy",
  name: "Gunpoint Diplomacy",
  displayName: "Gunpoint Diplomacy",
  rulesText:
    "Give a friendly Unit these effects. If you have less ☆ (Street Cred) than a Rival, they instead choose one effect for you.\nThe next time this Unit attacks this turn, it may attack ready Units. // Give this Unit +3 power this turn.",
  color: "red",
  classifications: ["Ganger", "Plan"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "032",
  artist: "Rafael de Latorre",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/032.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Give a friendly Unit these effects. If you have less ☆ (Street Cred) than a Rival, they instead choose one effect for you. The next time this Unit attacks this turn, it may attack ready Units. // Give this Unit +3 power this turn.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedUnit",
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
        },
      ],
      effects: [
        {
          effect: "chooseEffect",
          chooser: "rival",
          options: [
            {
              id: "both",
              label: "Attack ready Units this turn and get +3 power",
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
                  effect: "grantRule",
                  target: {
                    selector: "bound",
                    id: "selectedUnit",
                  },
                  rule: "canAttackReadyUnits",
                  duration: "turn",
                  uses: 1,
                },
                {
                  effect: "modifyPower",
                  target: {
                    selector: "bound",
                    id: "selectedUnit",
                  },
                  value: 3,
                  duration: "turn",
                },
              ],
            },
            {
              id: "ready-attack",
              label: "The next time this Unit attacks this turn, it may attack ready Units",
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
                  effect: "grantRule",
                  target: {
                    selector: "bound",
                    id: "selectedUnit",
                  },
                  rule: "canAttackReadyUnits",
                  duration: "turn",
                  uses: 1,
                },
              ],
            },
            {
              id: "plus-power",
              label: "Give this Unit +3 power this turn",
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
                    selector: "bound",
                    id: "selectedUnit",
                  },
                  value: 3,
                  duration: "turn",
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
  cost: 4,
}) satisfies ProgramCardDefinition;
