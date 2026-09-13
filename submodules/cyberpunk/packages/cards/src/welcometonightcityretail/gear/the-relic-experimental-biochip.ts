import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailTheRelicExperimentalBiochip = defineCyberpunkCard({
  id: "1263e2bf-bc15-4550-ad07-b028602d1354",
  canonicalId: "the-relic-experimental-biochip",
  slug: "the-relic-experimental-biochip",
  subname: "Experimental Biochip",
  name: "The Relic",
  displayName: "The Relic: Experimental Biochip",
  rulesText:
    "{Defeated} Play another Unit with cost 9 or less from your trash for free. Then, bottom-deck this Unit.",
  color: "yellow",
  classifications: ["Arasaka", "Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "063",
  artist: "Dardo Studios",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/063.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  abilities: [
    {
      kind: "triggered",
      text: "Defeated Play another Unit with cost 9 or less from your trash for free. Then, bottom-deck this Unit.",
      trigger: {
        trigger: "defeated",
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
            zones: ["trash"],
            cardTypes: ["unit"],
            maxCost: 9,
            // "another Unit" — not the defeated host this Gear was equipped to.
            excludeOf: {
              selector: "host",
            },
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
          effect: "playCard",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          free: true,
        },
        {
          // Printed "this Unit" is the defeated host, not the Gear itself.
          effect: "moveCard",
          target: {
            selector: "host",
          },
          destination: "deckBottom",
        },
      ],
    },
  ],
  attachment: {
    text: "Equip to a friendly Unit or face-up Legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  },
  type: "gear",
  cost: 5,
  power: 3,
}) satisfies GearCardDefinition;
