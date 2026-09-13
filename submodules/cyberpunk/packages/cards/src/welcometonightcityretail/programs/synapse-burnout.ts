import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSynapseBurnout = defineCyberpunkCard({
  id: "f3ba5ef7-5e91-4956-a887-b88a4b854867",
  canonicalId: "synapse-burnout",
  slug: "synapse-burnout",
  name: "Synapse Burnout",
  displayName: "Synapse Burnout",
  rulesText:
    "{Quick} A friendly Unit has +1 power for each friendly face-up Legend while fighting rival Units this turn.",
  color: "green",
  classifications: ["Quickhack"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "102",
  artist: "Michal Ivan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/102.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  keywords: ["quick"],
  abilities: [
    quickAbility(),
    {
      kind: "triggered",
      text: "A friendly Unit has +1 power for each friendly face-up Legend while fighting rival Units this turn.",
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
          effect: "modifyPower",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          value: {
            type: "perCount",
            multiplier: 1,
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["legendArea"],
              cardTypes: ["legend"],
              face: "faceUp",
            },
          },
          duration: "turn",
          whileFighting: true,
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 1,
}) satisfies ProgramCardDefinition;
