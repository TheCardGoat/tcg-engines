import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailSaulBrightStormrider = defineCyberpunkCard({
  id: "a29490bb-2836-48b6-a4f9-a44b25c8bfa2",
  canonicalId: "saul-bright-stormrider",
  slug: "saul-bright-stormrider",
  rulesText:
    "Other friendly Units have +2 power while attacking.\nAt the end of your turn, ready up to 3 friendly Units.",
  name: "Saul Bright — Stormrider",
  displayName: "Saul Bright — Stormrider",
  color: "green",
  classifications: ["Aldecado", "Nomad"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "089",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/089.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "static",
      text: "Other friendly Units have +2 power while attacking.",
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            excludeSelf: true,
          },
          value: 2,
          duration: "continuous",
          conditions: [
            {
              condition: "attacking",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
    {
      kind: "triggered",
      text: "At the end of your turn, ready up to 3 friendly Units.",
      trigger: {
        trigger: "event",
        event: {
          event: "turnEnded",
          player: "friendly",
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ready",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            state: "spent",
            selection: {
              mode: "choose",
              min: 0,
              max: 3,
            },
          },
        },
      ],
    },
  ],
  type: "unit",
  cost: 8,
  power: 14,
}) satisfies UnitCardDefinition;
