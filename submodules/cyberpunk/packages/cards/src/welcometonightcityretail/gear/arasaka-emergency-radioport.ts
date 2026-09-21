import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailArasakaEmergencyRadioport = defineCyberpunkCard({
  id: "5233bacc-f39f-4383-8e25-57ef634735ca",
  canonicalId: "arasaka-emergency-radioport",
  slug: "arasaka-emergency-radioport",
  name: "Arasaka Emergency Radioport",
  displayName: "Arasaka Emergency Radioport",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit or Legend is spent, you may look at a friendly face-down Legend. If that Legend is ARASAKA or has {Go Solo}, you may Call it for free. (You may only Call a Legend once per turn.)",
  color: "red",
  classifications: ["Arasaka", "Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "023",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/023.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit or Legend is spent, you may look at a friendly face-down Legend. If that Legend is ARASAKA or has Go Solo, you may Call it for free.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardSpent",
          player: "friendly",
          target: {
            selector: "host",
          },
        },
      },
      source: {
        selector: "host",
      },
      bindings: [
        {
          id: "selectedLegend",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["legendArea"],
            cardTypes: ["legend"],
            face: "faceDown",
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "lookAt",
          target: {
            selector: "bound",
            id: "selectedLegend",
          },
          revealToOpponent: false,
        },
        {
          effect: "callLegend",
          player: "friendly",
          target: {
            selector: "bound",
            id: "selectedLegend",
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          free: true,
          optional: true,
          conditions: [
            {
              condition: "any",
              of: [
                {
                  condition: "targetExists",
                  target: {
                    selector: "bound",
                    id: "selectedLegend",
                    classifications: ["Arasaka"],
                  },
                },
                {
                  condition: "targetExists",
                  target: {
                    selector: "bound",
                    id: "selectedLegend",
                    keywords: ["goSolo"],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["You may only Call a Legend once per turn."],
  type: "gear",
  cost: 2,
  power: 2,
  attachment: {
    text: "Equip to a unit or face-up legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  },
}) satisfies GearCardDefinition;
